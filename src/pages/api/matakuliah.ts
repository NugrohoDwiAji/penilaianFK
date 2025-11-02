import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "./componnents/response";

const handlePostMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const datamk = req.body;
    if (!datamk) {
      response(404, datamk, "Data not found", res);
    }
    if (datamk.length !== 0) {
      const result = Promise.all(datamk.map(({kode_matakuliah, nama_matakuliah}:{kode_matakuliah: string, nama_matakuliah: string}) => {
        return prisma.matakuliah.createMany({
          data: {
            kode_mk: kode_matakuliah,
            nama_matakuliah: nama_matakuliah,
          },
          skipDuplicates: true,
        });
      }));
      response(200, result, "Success", res);
    }
  } catch (error) {
    response(500, error, "Internal server error", res);
  }
};

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.matakuliah.findMany({});
    response(200, result, "Success", res);
  } catch (error) {
    response(500, error, "Internal server error", res);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return handlePostMethode(req, res);
  }
  if (req.method === "GET") {
    return handleGetMethode(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
