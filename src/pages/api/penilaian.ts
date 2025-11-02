import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { Prisma } from "@prisma/client";
import { response } from "./componnents/response";

// type type Komponen = {
type Komponen = {
  id: string;
  nama: string;
  bobot: number;
};

type NilaiKomponen = {
  komponen_id: string;
  nilai: number;
};

// Fungsi bantu cari node (rekursif)
// async function updateNilaiRekursif(
//   tx: Prisma.TransactionClient,
//   sumatifId: string
// ) {
//   const sumatif = await tx.sumatifPersen.findUnique({
//     where: { id: sumatifId },
//     include: { children: true, parent: true }, // penting: ambil parent juga
//   });

//   if (!sumatif) return;

//   // 1️⃣ Rekursif ke anak terlebih dahulu agar nilai anak sudah terhitung
//   for (const child of sumatif.children) {
//     await updateNilaiRekursif(tx, child.id);
//   }

//   // 2️⃣ Ambil nilai semua anak dari tabel nilai awal
//   if (sumatif.children.length > 0) {
//     const nilaiAnak = await tx.sumatifNilaiAwal.findMany({
//       where: { sumatifPersenId: { in: sumatif.children.map((c) => c.id) } },
//     });

//     if (nilaiAnak.length > 0) {
//       const totalBobot = sumatif.children.reduce((a, c) => a + c.bobot, 0);
//       const nilaiParent = nilaiAnak.reduce((total, n) => {
//         const child = sumatif.children.find((c) => c.id === n.sumatifPersenId);
//         if (!child) return total;
//         const proporsi = child.bobot / totalBobot;
//         return total + n.nilai * proporsi;
//       }, 0);

//       const existing = await tx.sumatifNilaiAwal.findFirst({
//         where: {
//           sumatifPersenId: sumatif.id,
//           khsDetailId: nilaiAnak[0].khsDetailId,
//         },
//       });

//       await tx.sumatifNilaiAwal.upsert({
//         where: { id: existing?.id },
//         update: { nilai: Math.round(nilaiParent) },
//         create: {
//           nilai: Math.round(nilaiParent),
//           sumatifPersen: { connect: { id: sumatif.id } },
//           KhsDetail: {
//             connect: { id_khs_detail: nilaiAnak[0].khsDetailId },
//           },
//         },
//       });
//     }
//   }

//   // 3️⃣ Setelah parent ini di-update, perbarui parent-nya (naik ke atas)
//   if (sumatif.parentId) {
//     await updateNilaiRekursif(tx, sumatif.parentId);
//   }
// }

async function updateNilaiKeAtas(tx: Prisma.TransactionClient, sumatifId: string) {
  let currentId = sumatifId as string | null;

  while (currentId) {
    const sumatif = await tx.sumatifPersen.findUnique({
      where: { id: currentId },
      include: { children: true, parent: true },
    });

    if (!sumatif) break;

    if (sumatif.children.length > 0) {
      const nilaiAnak = await tx.sumatifNilaiAwal.findMany({
        where: { sumatifPersenId: { in: sumatif.children.map((c) => c.id) } },
      });

      if (nilaiAnak.length > 0) {
        const totalBobot = sumatif.children.reduce((a, c) => a + c.bobot, 0);
        const nilaiParent = nilaiAnak.reduce((total, n) => {
          const child = sumatif.children.find((c) => c.id === n.sumatifPersenId);
          if (!child) return total;
          const proporsi = child.bobot / totalBobot;
          return total + n.nilai * proporsi;
        }, 0);

        const existing = await tx.sumatifNilaiAwal.findFirst({
          where: {
            sumatifPersenId: sumatif.id,
            khsDetailId: nilaiAnak[0].khsDetailId,
          },
        });

        await tx.sumatifNilaiAwal.upsert({
          where: { id: existing?.id },
          update: { nilai: Math.round(nilaiParent) },
          create: {
            nilai: Math.round(nilaiParent),
            sumatifPersen: { connect: { id: sumatif.id } },
            KhsDetail: { connect: { id_khs_detail: nilaiAnak[0].khsDetailId } },
          },
        });
      }
    }

    currentId  = sumatif.parentId ?? null; // naik satu tingkat
  }
}



async function handleEditNilai(req: NextApiRequest, res: NextApiResponse) {
  const { data_nilai } = req.body;

  try {
    if (!Array.isArray(data_nilai))
      return response(400, null, "Data harus berupa array", res);

    const hasilSimpan: unknown[] = [];

    await prisma.$transaction(async (tx) => {
      for (const mhs of data_nilai) {
        const khsDetail = await tx.khsDetail.findFirst({
          where: {
            krsDetail: {
              krs: { mahasiswa: { nim: mhs.nim } },
              mkId: mhs.mkId,
            },
          },
        });
        if (!khsDetail) continue;

        // Simpan atau update nilai untuk komponen paling bawah
        for (const komponen of mhs.nilai_komponen) {
          // cari id nilai sumatif awal
          const existing = await tx.sumatifNilaiAwal.findFirst({
            where: {
              sumatifPersenId: komponen.komponen_id,
              khsDetailId: khsDetail.id_khs_detail,
            },
          });

          await tx.sumatifNilaiAwal.upsert({
            where: {
              id: existing?.id,
            },
            update: { nilai: komponen.nilai },
            create: {
              nilai: komponen.nilai,
              sumatifPersen: { connect: { id: komponen.komponen_id } },
              KhsDetail: {
                connect: { id_khs_detail: khsDetail.id_khs_detail },
              },
            },
          });
        }

        // Jalankan perhitungan rekursif mulai dari parent tertinggi
        await updateNilaiKeAtas(tx, mhs.sumatif_id);

        hasilSimpan.push({ nim: mhs.nim, nama: mhs.nama_mahasiswa });
      }
    });

    response(200, hasilSimpan, "Nilai berhasil diperbarui", res);
  } catch (err) {
    console.error(err);
    response(500, err, "Terjadi kesalahan server", res);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { mkId } = req.query;
    const data = await prisma.sumatifNilaiAwal.findMany({
      where: {
        sumatifPersen: { mkId: mkId as string, parentId: null },
      },
      include: {
        KhsDetail: {
          include: {
            krsDetail: {
              include: {
                krs: {
                  include: {
                    mahasiswa: {
                      select: {
                        nama_mhs: true,
                        nim: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },

        sumatifPersen: {
          include: {
            matakuliah: {
              select: {
                kode_mk: true,
                nama_matakuliah: true,
              },
            },
            sumatifNilaiAwal: {
              select: {
                nilai: true,
              },
            },
            children: {
              include: {
                matakuliah: {
                  select: {
                    kode_mk: true,
                    nama_matakuliah: true,
                  },
                },
                sumatifNilaiAwal: {
                  select: {
                    nilai: true,
                  },
                },
                children: {
                  include: {
                    matakuliah: {
                      select: {
                        kode_mk: true,
                        nama_matakuliah: true,
                      },
                    },
                    sumatifNilaiAwal: {
                      select: {
                        nilai: true,
                      },
                    },
                    children: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const dataRes = {
      nama: data[0].KhsDetail.krsDetail.krs.mahasiswa.nama_mhs,
      nim: data[0].KhsDetail.krsDetail.krs.mahasiswa.nim,
      matakuliah: data[0].sumatifPersen.matakuliah.nama_matakuliah,
      nilai: data[0].KhsDetail.nilai,
      sumatif: [
        data.map((item) => ({
          nama: item.sumatifPersen.nama,
          bobot: item.sumatifPersen.bobot,
          nilai: item.sumatifPersen.sumatifNilaiAwal[0].nilai,
          child: item.sumatifPersen.children?.map((item) => ({
            nama: item.nama,
            nilai: item.sumatifNilaiAwal[0
            ].nilai,
            child: item.children?.map((child) => ({
              nama: child.nama,
              nilai: child.sumatifNilaiAwal[0].nilai,
            })),
          })),
        })),
      ],
    };
    response(200, dataRes, "Success", res);
  } catch (err) {
    console.log(err);
    response(500, err, "Internal server error", res);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") return handleEditNilai(req, res);
  if (req.method === "GET") return handleGet(req, res);
  return res.status(405).json({ message: "Method not allowed" });
}
