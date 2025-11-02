import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "./componnents/response";

const handleGetMethode = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {};

const handlePostMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const krs = req.body;
    if (krs.length == 0) {
      return res.status(400).json({ message: "nim dan nama_mhs harus diisi" });
    }
    const result = await Promise.all(
      krs.map(
        ({
          tahun_akademik,
          semester,
          nim,
          krsDetail,
        }: {
          tahun_akademik: string;
          semester: string;
          nim: string;
          krsDetail: [];
        }) => {
          return prisma.krs.create({
            data: {
              tahun_akademik: tahun_akademik,
              semester: semester,
              nim: nim,
              KrsDetail: {
                create: krsDetail.map(({ mkId }) => (
                    { mkId: mkId,
                        KhsDetail: {
                            create:{
                                nilai: 0
                            }
                        }
                    }
                )),
              },
              Khs:{
                create:{}
              }
            },

            include: {
              KrsDetail: true,
            },
            
          });
        }
        
      )
    );
    response(200, result, "Success", res);
  } catch (error) {
    console.log(error);
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
