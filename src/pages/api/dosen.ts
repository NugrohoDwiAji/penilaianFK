import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "./componnents/response";
import axios from "axios";

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.dosen.findMany({});
    response(200, result, "Success", res);
  } catch (error) {
    response(500, error, "Internal server error", res);
  }
};

const handlePostMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const dataDosen = await axios.get(
      "https://backbone.universitasbumigora.ac.id/api/v1/dosen/dosen_prodi/23"
    );

    if (!dataDosen.data || dataDosen.data.length === 0) {
      return response(404, [], "Data not found", res);
    }

    const result = await prisma.$transaction(async (tx) => {
      const created = [];

      for (const { nama_dosen, nik, alamat_email } of dataDosen.data) {
        // 1️⃣ create dosen jika belum ada
        const dosen = await tx.dosen.upsert({
          where: { nik },
          update: {}, // tidak update apa-apa
          create: {
            nama_dosen,
            nik,
            password: "FK2025",
            is_online: false,
          },
        });

        // 2️⃣ buat user yang relasinya one-to-one ke dosen
        await tx.user.upsert({
          where: { dosenId: dosen.id_dosen },
          update: {}, // tidak update apa-apa
          create: {
            dosenId: dosen.id_dosen,
            email: alamat_email,
            password: "FK2025",
            role: "dosen",
          },
        });

        created.push({ dosen });
      }

      return created;
    });

    return response(200, result, "Success", res);
  } catch (error) {
    console.log(error)
    return response(500, error, "Internal server error", res);
  }
};



export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetMethode(req, res);
  }
  if (req.method === "POST") {
    return handlePostMethode(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
