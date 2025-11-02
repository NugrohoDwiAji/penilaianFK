import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import prisma from "@/services/prisma";
import { response } from "./componnents/response";

type SumatifNode = {
  nama: string;
  bobot: number;
  children: SumatifNode[];
  mkId: string;
};

const createRecrusive = (
  node: SumatifNode,
  mkId: string,
  parentId: string | null = null
): Prisma.SumatifPersenCreateInput => {
  const { nama, bobot, children } = node;

  return {
    nama,
    bobot,
    parent: parentId ? { connect: { id: parentId } } : undefined,
    matakuliah: {
      connect: {
        id_mk: mkId,
      },
    },
    children: children
      ? {
          create: children.map((child) => createRecrusive(child, mkId)),
        }
      : undefined,
  };
};

const handlePostMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);

  try {
    const body: SumatifNode[] = Array.isArray(req.body) ? req.body : [req.body];

    for (const node of body) {
      if (!node.nama || !node.bobot || !node.mkId) {
        return res
          .status(400)
          .json({ message: "nama dan bobot dan mkId harus diisi" });
      }
    }

    const sumatifList = await prisma.$transaction(
      body.map((node) =>
        prisma.sumatifPersen.create({
          data: createRecrusive(node, node.mkId),
          include: {
            children: true,
          },
        })
      )
    );

    response(200, sumatifList, "Success", res);
  } catch (error) {
    response(500, error, "Internal server error", res);
  }
};

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { mkId } = req.query;
    const result = await prisma.sumatifPersen.findMany({
      where: {
        matakuliah: {
          id_mk: mkId as string,
        },
      },
    });
    response(200, result, "Success", res);
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
