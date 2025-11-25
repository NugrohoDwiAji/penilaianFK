import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "./componnents/response";
import { Prisma } from "@prisma/client";

// 🔹 fungsi bantu untuk ambil semua parent ke atas
async function getAllParents(
  tx: Prisma.TransactionClient,
  nodeId: string,
  result: Set<string>
) {
  const node = await tx.sumatifPersen.findUnique({
    where: { id: nodeId },
    select: { parentId: true },
  });

  if (node?.parentId) {
    result.add(node.parentId);
    await getAllParents(tx, node.parentId, result);
  }
}



// 🔹 fungsi bantu untuk ambil semua children ke bawah
async function getAllChildren(
  tx: Prisma.TransactionClient,
  nodeId: string,
  result: Set<string>
) {
  const children = await tx.sumatifPersen.findMany({
    where: { parentId: nodeId },
    select: { id: true },
  });

  for (const child of children) {
    result.add(child.id);
    await getAllChildren(tx, child.id, result);
  }
}

const handlePostMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    nama_kelas,
    mkId,
    semester,
    tahun_akademik,
    dosen,
    mahasiswa,
    sumatifPersen,
  } = req.body;

  if (
    !nama_kelas ||
    !mkId ||
    !semester ||
    !tahun_akademik ||
    !dosen ||
    !mahasiswa
  ) {
    response(400, null, "Semua field harus diisi", res);
    return;
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const kelas = await tx.kelas.create({
        data: {
          nama_kelas,
          matakuliah: {
            connect: { id_mk: mkId },
          },
          semester,
         sumatifPersen: sumatifPersen === "nonBlok" ? undefined : { connect: { id: sumatifPersen } }, 
          thn_akademik: tahun_akademik,
          validasi: false,
        },
      });

      await tx.kelasDosen.create({
        data: {
          dosenId: dosen,
          kelasId: kelas.id_kelas,
        },
      });

      if (Array.isArray(mahasiswa) && mahasiswa.length > 0) {
        const krsDetails = await tx.krsDetail.findMany({
          where: {
            krs: {
              nim: { in: mahasiswa.map((m) => m.nim) },
            },
            mkId,
          },
          select: { id_krs_detail: true },
        });

        await tx.kelasMahasiswa.createMany({
          data: krsDetails.map((krs) => ({
            krsDetailId: krs.id_krs_detail,
            kelasId: kelas.id_kelas,
          })),
        });

        const semuaSumatifAwal = await tx.sumatifPersen.findMany({
          where: sumatifPersen !== "nonBlok" ? { id : sumatifPersen  } : { mkId: mkId as string },
          select: { id: true },
        });

        const semuaId = new Set<string>();

        await Promise.all(
          semuaSumatifAwal.map(async (sumatif) => {
            semuaId.add(sumatif.id);
            if (sumatifPersen !== "nonBlok") {
            await getAllParents(tx, sumatif.id, semuaId)
            await getAllChildren(tx, sumatif.id, semuaId)
          }
          
        })
      );
        // 🔹 konversi ke array untuk digunakan di bawah
        const semuaSumatif = Array.from(semuaId);
        console.log("✅ Semua ID Sumatif (parent + children):", semuaSumatif);

        // 🔹 ambil khsDetail yang sesuai dengan krsDetail tadi
        const khsDetails = await tx.khsDetail.findMany({
          where: {
            krsDetailId: {
              in: krsDetails.map((krs) => krs.id_krs_detail),
            },
          },
          select: { id_khs_detail: true },
        });

        // 🔹 buat kombinasi nilai awal untuk setiap khsDetail × sumatifPersen
     const dataSumatifNilaiAwal = [];

for (const khs of khsDetails) {
  for (const sumatifId of semuaSumatif) {
    
    // 🔹 cek apakah data sudah ada
    const existing = await tx.sumatifNilaiAwal.findFirst({
      where: {
        khsDetailId: khs.id_khs_detail,
        sumatifPersenId: sumatifId,
      },
      select: { id: true },
    });

    // 🔹 jika sudah ada → skip
    if (existing) continue;

    // 🔹 jika belum ada → masukkan ke array
    dataSumatifNilaiAwal.push({
      khsDetailId: khs.id_khs_detail,
      sumatifPersenId: sumatifId,
      nilai: 0,
    });
  }
}

// 🔹 insert hanya data yang belum pernah ada
if (dataSumatifNilaiAwal.length > 0) {
  await tx.sumatifNilaiAwal.createMany({
    data: dataSumatifNilaiAwal,
  });
}
      }
      return { kelas };
    });

    response(200, result, "Success", res);
  } catch (error) {
    console.log(error);
    response(500, error, "Internal server error", res);
  }
};

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { mkId } = req.query;
    const result = await prisma.kelas.findMany({
      where: {
        mkId: mkId as string,
      },
      include: {
        KelasDosen: {
          include: {
            dosen: {
              select: {
                nama_dosen: true,
                nik: true,
              },
            },
          },
        },
        KelasMahasiswa: {
          include: {
            KrsDetail: {
              include: {
                krs: {
                  include: {
                    mahasiswa: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    response(200, result, "Success", res);
  } catch (error) {
    response(500, error, "Internal server error", res);
  }
};

const handleDeleteMethode = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;
    const result = await prisma.kelas.delete({
      where: {
        id_kelas: id as string,
      },
    });
    response(200, result, "Success", res);
  } catch (error) {
    response(500, error, "Internal server error", res);
    console.log(error);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handlePostMethode(req, res);
  }
  if (req.method === "GET") {
    return handleGetMethode(req, res);
  }
  if (req.method === "DELETE") {
    return handleDeleteMethode(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
