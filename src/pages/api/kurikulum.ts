import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "./componnents/response";

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.sumatifPersen.findMany({
      where: {
        parentId : null,
      },
      include: {
        matakuliah: true,
        children: {
          include: {
            children: {
              include: {
                children: true, // bisa diperpanjang kalau level dalam
              },
            },
          },
        },
      },
    });
    response(200, result, "Success", res);
  } catch (error) {
    response(500, error, "Internal server error", res);
    console.log(error);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetMethode(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
