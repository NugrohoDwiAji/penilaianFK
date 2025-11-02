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

const handlePostMethode = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {

    try {
        const dataDosen = await axios.get('https://backbone.universitasbumigora.ac.id/api/v1/dosen/dosen_prodi/23')

        if(!dataDosen.data) {
            response(404, dataDosen.data, "Data not found", res);
        }
        if(dataDosen.data.length !== 0) {
            const result =await Promise.all(dataDosen.data.map(({nama_dosen, nik}: {  nama_dosen: string, nik: string}) => {
              return prisma.dosen.createMany({
                data:{
                  nama_dosen:nama_dosen,
                  nik: nik,
                  password: "FK2025",
                  is_online: false
                },
                skipDuplicates: true
              })
            }))
            response(200, result, "Success", res);
        }
        
    } catch (error) {
        response(500, error, "Internal server error", res);
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
