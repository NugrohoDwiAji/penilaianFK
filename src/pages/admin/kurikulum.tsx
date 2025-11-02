import axios from "axios";
import React, { useState, useEffect } from "react";
import TahunAkademik from "@/components/datas/tahunAkademik.json";

// Definisi tipe data
interface DataItem {
  id: string;
  nama: string;
  bobot: number;
  parentId: string | null;
  mkId: string;
  created_at: string;
  updated_at: string;
  level: number;
  children: DataItem[];
  matakuliah?: {
    id_mk: string;
    kode_mk: string;
    nama_matakuliah: string;
  };
}

const flattenData = (
  items: DataItem[] | null,
  level: number = 0
): Array<DataItem & { level: number }> => {
  if (!items) return []; // cegah error forEach

  const result: Array<DataItem & { level: number }> = [];

  items.forEach((item) => {
    result.push({ ...item, level });
    if (item.children && item.children.length > 0) {
      result.push(...flattenData(item.children, level + 1));
    }
  });

  return result;
};

// Komponen utama
const Kurikulum: React.FC = () => {
  const [datas, setDatas] = useState<DataItem[] | null>(null);
  const [flatData, setFlatData] = useState<Array<DataItem & { level: number }>>(
    []
  );

  const handleGetAllSumatif = async () => {
    try {
      const result = await axios.get("/api/kurikulum");
      setDatas(result.data.datas);
    } catch (error) {
      console.error(error);
    }
  };

  // ambil hanya unique mkId
  const uniqueParents = flatData
    ?.filter((item) => item.parentId === null) // hanya parent
    .reduce((acc: DataItem[], curr) => {
      if (!acc.some((x) => x.matakuliah?.id_mk === curr.matakuliah?.id_mk)) {
        acc.push(curr); // ambil hanya yang pertama
      }
      return acc;
    }, []);

  useEffect(() => {
    handleGetAllSumatif();
  }, []);

  useEffect(() => {
    if (datas) {
      setFlatData(flattenData(datas));
    }
  }, [datas]);

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Data Table</h1>
          <p className="text-gray-600 mt-2">
            Tabel sederhana menampilkan nama dan bobot
          </p>
        </div>

        {/* table */}
        <div className="bg-white ring-2 ring-gray-300 shadow-lg rounded-lg">
          <div className="h-20 w-full bg-white rounded-lg flex items-center px-10 justify-end">
            <div className="flex items-center gap-3">
              <select
                name=""
                id=""
                className="border-2 border-gray-400 w-52 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900  bg-white"
              >
                <option value="">--- Tahun Akademik ---</option>
                {TahunAkademik.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.tahun}-{item.semester}
                  </option>
                ))}
              </select>

              <select
                name=""
                id=""
                className="border-2 border-gray-400 w-36 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900  bg-white"
              >
                <option value="">--- Semester ---</option>
              </select>
            </div>
          </div>
          <table className="w-full rounded-lg">
            <thead className="">
              <tr className="bg-gray-100 rounded-t-lg">
                <th className="ring-2 ring-gray-300 px-4 py-2 text-center font-semibold text-gray-700 bg-gray-100 w-52 ">
                  Blok / Non Blok
                </th>
                <th className="ring-2 ring-gray-300 px-4 py-2 text-left font-semibold text-gray-700 bg-gray-100">
                  Nama
                </th>
                <th className="ring-2 ring-gray-300 px-4 py-2 text-center font-semibold text-gray-700 bg-gray-100 w-24 ">
                  Bobot
                </th>
              </tr>
            </thead>
            <tbody>
              {flatData.map((item) => (
                <tr
                  key={item.id}
                  className={`${
                    item.parentId === null &&
                    uniqueParents?.some((x) => x.id === item.id)
                      ? "bg-blue-300/50"
                      : ""
                  }`}
                >
                  <td className="ring ring-gray-300 px-4 py-2 text-center ">
                    {item.parentId === null &&
                    uniqueParents?.some((x) => x.id === item.id)
                      ? item.matakuliah?.nama_matakuliah
                      : ""}
                  </td>
                  <td className="ring ring-gray-300 px-4 py-2">
                    <div style={{ paddingLeft: `${item.level * 20}px` }}>
                      {item.nama}
                    </div>
                  </td>
                  <td className="ring ring-gray-300 px-4 py-2 text-center">
                    {item.bobot}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 bg-white border border-gray-300 p-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold">Total Items:</span>{" "}
              {flatData.length}
            </div>
            <div>
              <span className="font-semibold">Total Bobot:</span>{" "}
              {flatData.reduce((sum, item) => sum + item.bobot, 0)}
            </div>
            <div>
              <span className="font-semibold">Parent Items:</span>{" "}
              {datas?.length ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kurikulum;
