import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "./componnents/response";
import axios from "axios";

interface Status {
  code: number;
  description: string;
}
interface Matakuliah {
  id_matakuliah: number,
  kode_matakuliah: string,
  nama_matakuliah: string,
  sks_teori: number,
  sks_praktek: number,
  sks_praktikum: number,
  tanggal_terbuat: string,
  semester: string,
  kode_kurikulum: number
}

interface result {
  kode_nama_kurikulum : string,
  angkatan : string,
  nama_kurikulum : string,
  matakuliah : Matakuliah[]
}

interface DataMK {
status: Status;
results: result[];

  
}

const handlePostMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("berjalan")
  try {
    const { data: datamk }: { data: DataMK }  = await axios.get("https://backbone.universitasbumigora.ac.id/api/v1/kedokteran/kurikulum/2025");
    if (!datamk) {
      response(404, datamk, "Data not found", res);
    }
    console.log(JSON.stringify(datamk.results[0].nama_kurikulum));
    if (datamk.status.code === 200) {
      const result = await Promise.all(datamk.results[0].matakuliah.map(({id_matakuliah, kode_matakuliah, nama_matakuliah }: Matakuliah) => {
        return prisma.matakuliah.createMany({
          data: {
            id_mk: id_matakuliah.toString(),
            kode_mk: kode_matakuliah,
            nama_matakuliah: nama_matakuliah,
            Kurikulum: datamk.results[0].nama_kurikulum
          },
          skipDuplicates: true,
        });
      }));
      response(200, result, "Success", res);
    }
  } catch (error) {
    console.log(error)
    response(500, error, "Internal server error", res);
  }
};

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.matakuliah.findMany({
      orderBy: {
        created_at: "asc",
      }
    });
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
