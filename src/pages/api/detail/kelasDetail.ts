import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import {response} from "../componnents/response";

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
    const {mkId} = req.query
    if (!mkId) {
        return res.status(400).json({ message: "mkId is required" });
    }
    try {
        const result = await prisma.kelas.findMany({
            where: {
                mkId:mkId as string
            },
            include: {
                matakuliah: {
                    select: {
                        nama_matakuliah: true
                    }
                },
                KelasDosen: {
                    include: {
                        dosen: true,
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
                          KhsDetail: {                 
                          },
                        },
                      }
                    },
                },
                sumatifPersen:{
                  select:{
                    id:true,
                    nama:true,
                    bobot:true
                  }  
                }
            },
        })
        response(200, result, "Success", res);
    } catch (error) {
        response(500, error, "Internal server error", res);
    }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return handleGetMethode(req, res);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}