import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "./componnents/response";

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
          sumatifPersen: { connect: {id:sumatifPersen}, },
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

        // 🔹 ambil semua sumatifPersen yang memiliki mkId yang sama
        const semuaSumatif = await tx.sumatifPersen.findMany({
          where: { mkId },
          select: { id: true },
        });

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
          for (const sumatif of semuaSumatif) {
            dataSumatifNilaiAwal.push({
              khsDetailId: khs.id_khs_detail,
              sumatifPersenId: sumatif.id,
              nilai: 0,
            });
          }
        }

        await tx.sumatifNilaiAwal.createMany({
          data: dataSumatifNilaiAwal,
        });
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
    console.log(error)
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
  }else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
