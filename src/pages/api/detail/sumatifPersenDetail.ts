// contoh pakai Next.js API route
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import { response } from "../componnents/response";

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, mkId } = req.query;
    const leafNodes = await prisma.sumatifPersen.findMany({
      where: id === "undefined" ? {mkId:mkId as string} : {parentId:id as string},
      orderBy:{bobot:"asc"},
      include: {
        matakuliah: {
          select: {
            kode_mk: true,
            nama_matakuliah: true,
          },
        },
        children: {
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    response(200, leafNodes, "Success", res);
  } catch (error) {
    console.error(error);
    response(500, error, "Internal server error", res);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetMethode(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
