import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "../componnents/response";



const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {id} = req.query;
        if(!id) return response(400, null, "id is required", res)
            const result = await prisma.krsDetail.findMany({
                where: {
                    mkId: id as string
                },
                include: {
                    krs: {
                        include: {
                            mahasiswa: true
                        }
                    }
                }
            })
            const data = result.map((item)=> ({
                id:item.id_krs_detail,
                nama: item.krs.mahasiswa.nama_mhs,
                nim: item.krs.mahasiswa.nim
            }))
            response(200, data, "Success", res);
    } catch (error) {
        response(500, error, "Internal server error", res);
    }
}



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") return handleGetMethode(req, res);
    res.status(405).json({ message: "Method not allowed" });
}



