"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import TableMhs from "./organisms/TabelMhs";
import { mahasiswaSyn } from "@/services/sync";
import { time } from "console";

type Data = {
  nama_mhs: string;
  nim: string;
  id_mhs: string;
};

export default function Mahasiswa() {
  const [dataMahasiswa, setDataMahasiswa] = useState<Data[]>([]);
  const [isSpin, setisSpin] = useState(false);

  const handlSyncMhs = () => {
    try {
      mahasiswaSyn((status) => {
        if (status) {
          setisSpin(true);
          setTimeout(() => {
            setisSpin(false);
          },3000);
        } else {
          setisSpin(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };


  const handleGetDosen = async () => {
    try {
      const result = await axios.get("/api/mahasiswa");
      setDataMahasiswa(result.data.datas);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetDosen();
  }, [isSpin]);

  return (
    <div className="">
      <div className="bg-white p-5 w-fit rounded-xl">
        <div className="flex justify-between items-center mb-7">
          <div>
            <input
              type="text"
              className="ring-2 ring-blue-200 p-1 rounded-lg outline-none text-gray-700 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              placeholder="search"
            />
          </div>
          <div>
            <button
              onClick={handlSyncMhs}
              className={`flex gap-2 items-center text-blue-800 font-semibold bg-blue-400/30 py-1 px-4 rounded-lg shadow-md hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer `}
            >
              sync
              <RefreshCw
                className={isSpin ? "animate-spin" : ""}
                strokeWidth={3}
              />
            </button>
          </div>
        </div>
        <TableMhs data={dataMahasiswa} />
      </div>
    </div>
  );
}
