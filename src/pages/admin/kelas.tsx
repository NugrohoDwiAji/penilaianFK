import React, { useState, useEffect } from "react";
import axios from "axios";
import { PenIcon, Plus, User } from "lucide-react";
import TahunAkademik from "@/components/datas/tahunAkademik.json";
import FlyerKelas from "@/components/flyerKelas";
import CardKelas from "@/components/CardKelas";

type Matakuliah = {
  id_mk: string;
  kode_mk: string;
  nama_matakuliah: string;
  created_at: string;
  update_at: string;
};

type DataKelas = {
  id_kelas: string;
  nama_kelas: string;
  created_at: string;
  KelasDosen: [
    {
      dosenId: string;
      dosen: {
        nama_dosen: string;
        nik: string;
      };
    }
  ];
};

export default function Kelas() {
  const [mataKuliah, setMataKuliah] = useState<Matakuliah[]>([]);
  const [selectedMk, setselectedMk] = useState<string>("");
  const [mkid, setmkid] = useState("");
  const [addKelas, setAddKelas] = useState(false);
  const [kurikulum, setKurikulum] = useState("");
  const [dataKelas, setDataKelas] = useState<DataKelas[]>([]);

  const handleGetMatakuliah = async () => {
    try {
      const response = await axios.get("/api/matakuliah");
      const data = response.data.datas;
      setMataKuliah(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const selectMk = (id_mk: string) => {
    setselectedMk(
      mataKuliah.find((mk) => mk.id_mk === id_mk)!.kode_mk +
        "-" +
        mataKuliah.find((mk) => mk.id_mk === id_mk)!.nama_matakuliah
    );
    setmkid(id_mk);
    handleGetKelas(id_mk);
  };

  const handleGetKelas = async (mkId: string) => {
    try {
      const response = await axios.get(`/api/kelas?mkId=${mkId}`);
      const data = response.data.datas;
      setDataKelas(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleGetMatakuliah();
  }, []);
  return (
    <div className="min-h-screen flex ">
      <div className=" w-fit bg-white h-fit p-5">
        <div className=" h-24 ">
          <select
            name=""
            id=""
            className="outline-none ring-2 ring-blue-400/50 rounded-lg p-2"
            onChange={(e) => setKurikulum(e.target.value)}
          >
            <option value="">--Pilih Kurikulum--</option>
            {TahunAkademik.map((item) => (
              <option key={item.id} value={item.tahun + "-" + item.semester}>
                {item.tahun}-{item.semester}
              </option>
            ))}
          </select>
        </div>
        <main className="flex gap-5">
          <table className="">
            <thead className="ring-2 ring-purple-400 rounded-lg text-purple-400">
              <tr>
                <th className=" p-2 bg-purple-100/100 rounded-l-lg">No</th>
                <th className=" bg-purple-100/100">Kode Matakuliah</th>
                <th className=" bg-purple-100/100 w-xs">Matakuliah</th>
                <th className=" bg-purple-100/100 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {mataKuliah.map((mk, index) => (
                <tr
                  key={mk.id_mk}
                  className={`${index % 2 === 1 ? "bg-blue-200/30" : ""}`}
                >
                  <td className="p-4 border-b-2 border-gray-400/20 text-center">
                    {index + 1}
                  </td>
                  <td className="p-4  border-b-2 border-gray-400/20 text-center">
                    {mk.kode_mk}
                  </td>
                  <td className="p-4 border-b-2 border-gray-400/20 text-center">
                    {mk.nama_matakuliah}
                  </td>
                  <td className="py-4 px-10 border-b-2 border-gray-400/20 flex gap-3">
                    <button
                      className="border p-2 rounded-lg bg-yellow-400/30 border-yellow-500 cursor-pointer"
                      onClick={() => selectMk(mk.id_mk)}
                    >
                      <PenIcon className="w-6 h-6 text-yellow-500" />
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      {/* daftar kelas */}
      {selectedMk && (
        <div className="ml-5 flex flex-col gap-4">
          <div id="kelas" className=" bg-white h-fit w-80 p-2 rounded-lg">
            <h1 className="font-semibold bg-blue-500/30 px-2 py-[2px] rounded-full text-blue-900 w-fit">
              {selectedMk}
            </h1>
          </div>
          <div className="flex flex-col gap-3">
            {dataKelas.map((kelas) => (
              <CardKelas
                key={kelas.id_kelas}
                idKelas={kelas.id_kelas}
                namaDosen={kelas.KelasDosen[0].dosen.nama_dosen}
                namaKelas={kelas.nama_kelas}
                nikDosen={kelas.KelasDosen[0].dosen.nik}
                tanggal={kelas.created_at.split("T")[0]}
                isDelete={false}
                isEdit={()=>{}}
                isSee={()=>{}}
              />
            ))}
          </div>
          <div className="flex gap-5 justify-center w-full mt-10 bg-white p-2 rounded-lg">
            <button
              onClick={() => setAddKelas(!addKelas)}
              className="bg-green-300/50 text-green-600 rounded-sm p-2 cursor-pointer"
            >
              <Plus />
            </button>
            <button className="bg-red-300/50 text-red-600 rounded-sm p-2 cursor-pointer">
              <User />
            </button>
          </div>
        </div>
      )}
      {addKelas && (
        <div className="absolute  flex ">
          <FlyerKelas
            onClick={() => setAddKelas(!addKelas)}
            mataKuliah={selectedMk}
            mkId={mkid}
            kurikulum={kurikulum}
          />
        </div>
      )}
    </div>
  );
}
