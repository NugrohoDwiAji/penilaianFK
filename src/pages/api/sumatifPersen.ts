import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "./componnents/response";

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  const { mkId } = req.query;
  if(!mkId) return response(400, null, "mkId is required", res)
  try {
    const data = await prisma.sumatifPersen.findMany({
      where: {
        mkId:  mkId as string,
        parentId: null, // hanya ambil root
      },
      include: {
      children:true ,
      },
    });

    response(200, data, "Success", res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetMethode(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
