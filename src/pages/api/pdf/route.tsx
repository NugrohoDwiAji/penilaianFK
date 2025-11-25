import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { NilaiKelas } from "../../../components/NilaiKelas";
import { Prisma } from "@prisma/client";
import prisma from "@/services/prisma";

export interface DataSumatifNilai {
  id_kelas: string;
  kelas_kelas: string;
  semester: number;
  thn_akademik: string;
  mahasiswa: {
    nama: string;
    nim: string;
    nilai: {
      id: string;
      parentid: string | null;
      sumatifId: string;
      nama: string;
      nilai: number;
    }[];
  }[];
}


// Ambil semua sumatifPersen sekali saja
async function getLeafSumatifIds(tx: Prisma.TransactionClient, rootId: string) {
  const all = await tx.sumatifPersen.findMany({
    select: { id: true, parentId: true, mkId: true },
  });

  // Buat map parent -> children
  const map = new Map<string, string[]>();
  for (const s of all) {
    if (!map.has(s.parentId || "")) map.set(s.parentId || "", []);
    map.get(s.parentId || "")!.push(s.id);
  }

  // Cek apakah rootId merupakan id sumatif atau mkId
  const isSumatifId = all.some((s) => s.id === rootId);

  // Fungsi rekursif untuk ambil semua turunan id
  const getDescendants = (id: string): string[] => {
    const children = map.get(id) || [];
    let result: string[] = [];
    for (const child of children) {
      result.push(child);
      result = result.concat(getDescendants(child));
    }
    return result;
  };

  // Jika rootId adalah mkId → ambil semua sumatifPersen berdasarkan mkId
  if (!isSumatifId) {
    const sameMk = await tx.sumatifPersen.findMany({
      where: { mkId: rootId },
      select: { id: true },
    });
    return sameMk.map((s) => s.id);
  }

  // Jika rootId adalah id sumatif → jalankan logika normal
  const descendants = getDescendants(rootId);
  const hasChildren = map.has(rootId) && map.get(rootId)!.length > 0;

  if (!hasChildren) {
    const root = all.find((s) => s.id === rootId);
    if (!root) return [];
    const sameMk = await tx.sumatifPersen.findMany({
      where: { mkId: root.mkId },
      select: { id: true },
    });
    return sameMk.map((s) => s.id);
  }

  const childrenSet = new Set(all.map((s) => s.parentId).filter(Boolean));
  const leafIds = descendants.filter((id) => !childrenSet.has(id));
  return leafIds;
}

const handleGetNilai = async (id: string, mkId: string): Promise<DataSumatifNilai[]> => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const leafIds = await getLeafSumatifIds(
        tx,
        id === "undefined" ? mkId : id
      );

      const data = await tx.kelas.findMany({
        where: id === "undefined"
          ? { mkId }
          : { sumatifPersenId: id },
        include: {
          KelasMahasiswa: {
            include: {
              KrsDetail: {
                include: {
                  KhsDetail: {
                    include: {
                      sumatifNilaiAwal: {
                        where: { sumatifPersenId: { in: leafIds } },
                        include: { sumatifPersen: true },
                        orderBy: { sumatifPersen: { list: "asc" } },
                      },
                    },
                  },
                  krs: {
                    include: {
                      mahasiswa: { select: { nim: true, nama_mhs: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return data.map((d) => ({
        id_kelas: d.id_kelas,
        kelas_kelas: d.nama_kelas,
        semester: d.semester,
        thn_akademik: d.thn_akademik,
        mahasiswa: d.KelasMahasiswa.map((km) => ({
          nama: km.KrsDetail.krs.mahasiswa.nama_mhs,
          nim: km.KrsDetail.krs.mahasiswa.nim,
          nilai: km.KrsDetail.KhsDetail[0]?.sumatifNilaiAwal.map((sn) => ({
            id: sn.id,
            parentid: sn.sumatifPersen.parentId,
            sumatifId: sn.sumatifPersen.id,
            nama: sn.sumatifPersen.nama,
            nilai: sn.nilai,
          })) ?? [],
        })),
      }));
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data nilai"); // ✔ throw instead of return
  }
};


async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id, mkId } = req.query;
  const hasil = await handleGetNilai(id as string, mkId as string);

  try {
    const pdfBuffer = await renderToBuffer(
  <NilaiKelas title="Laporan Nilai Kelas" dataNilai={hasil} />
);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=kartu-hasil.pdf"
    );
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("PDF error:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGet(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
