import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { Prisma } from "@prisma/client";
import { response } from "./componnents/response";

// Types (sesuaikan bila model DB berbeda)


type RawSumatif = {
  id: string;
  nama: string;
  bobot: number;
  nilai: number | null;
  children: RawSumatif[];
};

type MatakuliahData = {
  id: string;
  nama: string;
  bobot?: number;
  nilai: number | null;
  sumatif: RawSumatif[];
};

type DataMahasiswa = {
  id: string;
  nama: string;
  nim: string;
  mkId?: string;
  matakuliah?: MatakuliahData[];
  nilai_komponen?: { komponen_id: string; nilai: number }[];
};

type ApiResponse = {
  datas?: DataMahasiswa[] | unknown[];
  message: string;
};

// Type rekursif untuk SumatifPersen dengan children
type SumatifPersenRecursive = {
  id: string;
  nama: string;
  bobot: number;
  parentId: string | null;
  mkId: string;
  created_at?: Date;
  updated_at?: Date;
  children?: SumatifPersenRecursive[];
  parent?: SumatifPersenRecursive | null;
};

type TreeNode = SumatifPersenRecursive & {
  children: TreeNode[];
};


// Helper function untuk mapping sumatif
function mapSumatif(
  sp: SumatifPersenRecursive,
  nilaiMap: Map<string, number>
): RawSumatif {
  return {
    id: sp.id,
    nama: sp.nama,
    bobot: sp.bobot,
    nilai: nilaiMap.get(sp.id) ?? null,
    children: sp.children?.map((child) => mapSumatif(child, nilaiMap)) ?? [],
  };
}

// helper upsert untuk sumatifNilaiAwal (safe)
async function upsertSumatifNilaiAwal(
  tx: Prisma.TransactionClient,
  sumatifId: string,
  khsDetailId: string,
  nilai: number
) {
  const existing = await tx.sumatifNilaiAwal.findFirst({
    where: { sumatifPersenId: sumatifId, khsDetailId },
  });

  if (existing) {
    await tx.sumatifNilaiAwal.update({
      where: { id: existing.id },
      data: { nilai },
    });
  } else {
    await tx.sumatifNilaiAwal.create({
      data: {
        nilai,
        sumatifPersen: { connect: { id: sumatifId } },
        KhsDetail: { connect: { id_khs_detail: khsDetailId } },
      },
    });
  }
}

/**
 * Hitung nilai sumatif secara rekursif (bottom-up).
 * - Mengembalikan nilai (number)
 * - Menyimpan nilai ke tabel sumatifNilaiAwal (upsert)
 */
async function hitungSumatif(
  tx: Prisma.TransactionClient,
  sumatifId: string,
  khsDetailId: string
): Promise<number> {
  const node = await tx.sumatifPersen.findUnique({
    where: { id: sumatifId },
    include: { children: true },
  });

  if (!node) return 0;

  // leaf: ambil nilai leaf (nilai yang diinput)
  if (!node.children || node.children.length === 0) {
    const leaf = await tx.sumatifNilaiAwal.findFirst({
      where: { sumatifPersenId: sumatifId, khsDetailId },
    });
    const nilaiLeaf = leaf?.nilai ?? 0;
    // simpan juga agar selalu ada record leaf walau 0
    await upsertSumatifNilaiAwal(tx, sumatifId, khsDetailId, Math.round(nilaiLeaf));
    return nilaiLeaf;
  }

  // non-leaf: hitung semua anak dulu
  const totalBobot = node.children.reduce((s, c) => s + c.bobot, 0) || 0;
  let nilaiParent = 0;

  for (const child of node.children) {
    const nilaiChild = await hitungSumatif(tx, child.id, khsDetailId);
    // jika totalBobot 0, hindari pembagian 0 (anggap proporsi sama)
    const proporsi = totalBobot > 0 ? child.bobot / totalBobot : 1 / node.children.length;
    nilaiParent += nilaiChild * proporsi;
  }

  const nilaiFinal = Math.round(nilaiParent);

  // upsert nilai parent
  await upsertSumatifNilaiAwal(tx, node.id, khsDetailId, nilaiFinal);

  return nilaiFinal;
}

/**
 * Hitung nilai akhir matakuliah (root nodes dengan parentId = null)
 * lalu update khsDetail.nilai
 */
async function hitungNilaiMatakuliah(
  tx: Prisma.TransactionClient,
  mkId: string,
  khsDetailId: string
) {
  const rootSiblings = await tx.sumatifPersen.findMany({
    where: { parentId: null, mkId },
  });

  if (rootSiblings.length === 0) return;

  // pastikan semua root node dihitung dulu (agar sumatifNilaiAwal terisi)
  for (const r of rootSiblings) {
    await hitungSumatif(tx, r.id, khsDetailId);
  }

  const nilaiRoots = await tx.sumatifNilaiAwal.findMany({
    where: {
      sumatifPersenId: { in: rootSiblings.map((r) => r.id) },
      khsDetailId,
    },
  });

  if (nilaiRoots.length === 0) return;

  const totalBobotRoot = rootSiblings.reduce((a, c) => a + c.bobot, 0) || 0;
  const nilaiAkhir = nilaiRoots.reduce((total, n) => {
    const s = rootSiblings.find((r) => r.id === n.sumatifPersenId);
    if (!s) return total;
    const proporsi = totalBobotRoot > 0 ? s.bobot / totalBobotRoot : 1 / rootSiblings.length;
    return total + n.nilai * proporsi;
  }, 0);

  await tx.khsDetail.update({
    where: { id_khs_detail: khsDetailId },
    data: { nilai: Math.round(nilaiAkhir) },
  });
}

async function handleEditNilai(req: NextApiRequest, res: NextApiResponse) {
  const { data_nilai } = req.body;

  try {
    if (!Array.isArray(data_nilai)) return response(400, null, "Data harus berupa array", res);

    const hasilSimpan: unknown[] = [];

    await prisma.$transaction(async (tx) => {
      for (const mhs of data_nilai as DataMahasiswa[]) {
        // cari khsDetail berdasarkan nim + mkId seperti kode Anda sebelumnya
        const khsDetail = await tx.khsDetail.findFirst({
          where: {
            krsDetail: {
              krs: { mahasiswa: { nim: mhs.nim } },
              mkId: mhs.mkId,
            },
          },
        });

        if (!khsDetail) continue;

        // simpan setiap komponen leaf yang dikirim frontend
        for (const komponen of mhs.nilai_komponen || []) {
          // upsert leaf value langsung (create/update)
          const existing = await tx.sumatifNilaiAwal.findFirst({
            where: { sumatifPersenId: komponen.komponen_id, khsDetailId: khsDetail.id_khs_detail },
          });

          if (existing) {
            await tx.sumatifNilaiAwal.update({
              where: { id: existing.id },
              data: { nilai: komponen.nilai },
            });
          } else {
            await tx.sumatifNilaiAwal.create({
              data: {
                nilai: komponen.nilai,
                sumatifPersen: { connect: { id: komponen.komponen_id } },
                KhsDetail: { connect: { id_khs_detail: khsDetail.id_khs_detail } },
              },
            });
          }

          // setelah update leaf, hitung rekursif naik sampai root (hitungSumatif akan rekursif)
          await hitungSumatif(tx, komponen.komponen_id, khsDetail.id_khs_detail);
        }

        // setelah semua komponen untuk mahasiswa ini diproses, hitung nilai matakuliah akhir
        await hitungNilaiMatakuliah(tx, mhs.mkId!, khsDetail.id_khs_detail);

        hasilSimpan.push({ nim: mhs.nim, nama: mhs.nama });
      }
    });

    return response(200, hasilSimpan, "Nilai berhasil diperbarui", res);
  } catch (err) {
    console.error(err);
    return response(500, err, "Terjadi kesalahan server", res);
  }
}

function buildTree(
  list: SumatifPersenRecursive[],
  parentId: string | null
): TreeNode[] {
  return list
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      children: buildTree(list, item.id)
    }));
}


async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> {
  try {
    const dataMahasiswa = await prisma.mahasiswa.findMany({
      orderBy: { nim: "asc" },
      include: {
        krs: {
          include: {
            KrsDetail: {
              include: {
                matakuliah: true,
                KhsDetail: {
                  include: {
                    sumatifNilaiAwal: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const result: DataMahasiswa[] = [];

    for (const mhs of dataMahasiswa) {
      const mkList: MatakuliahData[] = [];

      for (const krs of mhs.krs) {
        for (const krsDetail of krs.KrsDetail) {
          const mk = krsDetail.matakuliah;
          const khsDetail = krsDetail.KhsDetail[0];

          // ambil semua struktur sumatifPersen pada mkId ini (TREE FULL)
          const semuaSumatif: SumatifPersenRecursive[] =
            await prisma.sumatifPersen.findMany({
              where: { mkId: mk.id_mk },
              orderBy: { created_at: "asc" }
            });

          // buat tree lengkap berdasarkan parentId
          const tree = buildTree(semuaSumatif, null);

          // map nilai
          const nilaiMap = new Map<string, number>();
          if (khsDetail) {
            for (const n of khsDetail.sumatifNilaiAwal) {
              nilaiMap.set(n.sumatifPersenId, n.nilai);
            }
          }

          // mapping rekursif tree + nilai
          const finalTree = tree.map(sp => mapSumatif(sp, nilaiMap));

          mkList.push({
            id: mk.id_mk,
            nama: mk.nama_matakuliah,
            nilai: khsDetail?.nilai ?? 0,
            sumatif: finalTree
          });
        }
      }

      result.push({
        id: mhs.id_mhs,
        nama: mhs.nama_mhs,
        nim: mhs.nim,
        matakuliah: mkList
      });
    }

    return res.status(200).json({ datas: result, message: "Success" });
  } catch (error) {
    console.error("Error in handleGet:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") return handleGet(req, res);
  if (req.method === "PUT") return handleEditNilai(req, res);
  res.status(405).json({ message: "Method not allowed" });
}