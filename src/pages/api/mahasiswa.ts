import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import {response} from "@/pages/api/componnents/response";
import axios from "axios";

type Data = {
   
    nama_mahasiswa: string;
    nim:number;
};

const handlePostMethode = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
         const dataMhs = await axios.get('https://backbone.universitasbumigora.ac.id/api/v1/kedokteran-mahasiswa')
    if(!dataMhs.data){
        response(404, dataMhs, "Data not found", res)
    }
     if(dataMhs.data.length !== 0){
        const result =await Promise.all(dataMhs.data.map(({nama_mahasiswa, nim}: Data) => {
            return prisma.mahasiswa.createMany({
                data:{
                   nama_mhs: nama_mahasiswa,
                    nim: nim.toString(),
                },
                skipDuplicates: true
            })
        }))
        response(200, result, "Success", res)
     }
    } catch (error) {
        response(500, error ,"Internal server error", res)
        console.log(error)
    }
}


const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const result = await prisma.mahasiswa.findMany({

        }) 
        response(200, result, "Success", res);
    } catch (error) {
        response(500, error, "Internal server error", res);
    }
}





export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        return handlePostMethode(req, res);
    } 
    if(req.method === 'GET'){
        return handleGetMethode(req, res);
    }else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}