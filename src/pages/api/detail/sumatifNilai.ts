import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import {response} from "../componnents/response";

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
    const {id} = req.query;
    try {
       const result = await prisma.kelas.findMany({
            where:{
                sumatifPersenId:id as string
                
            },
            
            include: {
                KelasMahasiswa:{
                    include: {
                        KrsDetail: {
                            include:{
                                KhsDetail:{
                                    include:{
                                        sumatifNilaiAwal: true
                                    }
                                },
                                krs: {
                                    include: {
                                        mahasiswa: {
                                            select:{
                                                nim: true,
                                                nama_mhs: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }
        });
        response(200, result, "Success", res);
    } catch (error) {
        response(500, error, "Internal server error", res);
    }
}




export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return handleGetMethode(req, res);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}