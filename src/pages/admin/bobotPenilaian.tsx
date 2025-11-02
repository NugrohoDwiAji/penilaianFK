"use client";
import React, { useState, useEffect } from "react";
import Kurikulum from "../../components/datas/kurikulum.json";
import { Plus } from "lucide-react";
import FormBobot from "@/components/organisms/FormBobot";
import axios from "axios";

type Penilaian = {
  nama: string;
  bobot: number;
  mkId?: string;
  children: Penilaian[];
};
type Matakuliah = {
  id_mk: string;
  kode_mk: string;
  nama_matakuliah: string;
  created_at: string;
  update_at: string;
};

const tahunAkademik = [
  { id: 1, tahun: "2022/2023", semester: "ganjil" },
  { id: 2, tahun: "2022/2023", semester: "genap" },
  { id: 3, tahun: "2023/2024", semester: "ganjil" },
  { id: 4, tahun: "2023/2024", semester: "genap" },
  { id: 5, tahun: "2024/2025", semester: "ganjil" },
  { id: 6, tahun: "2024/2025", semester: "genap" },
];

export default function BobotPenilaian() {
  const [penilaian, setPenilaian] = useState<Penilaian[]>([]);
  const [selectedMk, setSelectedMk] = useState<string>("");
  const [mataKuliah, setMataKuliah] = useState<Matakuliah[]>([]);

  const handleGetMatakuliah = async () => {
    try {
      const response = await axios.get("/api/matakuliah");
      const data = response.data.datas;
      setMataKuliah(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 🔹 Tambah komponen penilaian baru di level teratas
  const addRootPenilaian = () => {
    setPenilaian([
      ...penilaian,
      { nama: "", bobot: 0, mkId: selectedMk, children: [] },
    ]);
  };

  // 🔹 Tambah sub-penilaian berdasarkan path index
  const handleAddChild = (path: number[]) => {
    const newData = structuredClone(penilaian);
    let node: Penilaian = newData[path[0]];
    for (let i = 1; i < path.length; i++) {
      node = node.children[path[i]];
    }
    node.children.push({
      nama: "",
      bobot: 0,
      mkId: selectedMk,
      children: [],
    });
    setPenilaian(newData);
  };

  const handleDelChild = (path: number[]) => {
    const newData = structuredClone(penilaian);

    // Jika path hanya satu elemen, berarti hapus root node
    if (path.length === 1) {
      newData.splice(path[0], 1);
      setPenilaian(newData);
      return;
    }

    // Arahkan ke parent dari node yang akan dihapus
    let parent = newData[path[0]];
    for (let i = 1; i < path.length - 1; i++) {
      parent = parent.children[path[i]];
    }

    // Hapus child pada index terakhir dari path
    parent.children.splice(path[path.length - 1], 1);

    setPenilaian(newData);
  };

  // 🔹 Ubah nama/bobot berdasarkan path index
  const handleChange = (
    path: number[],
    key: keyof Pick<Penilaian, "nama" | "bobot">,
    value: string | number
  ) => {
    const newData = structuredClone(penilaian);
    let node: Penilaian = newData[path[0]];
    for (let i = 1; i < path.length; i++) {
      node = node.children[path[i]];
    }

    node[key] = value as never; // ✅ aman karena key dibatasi hanya ke 'nama' atau 'bobot'
    setPenilaian(newData);
  };

  // 🔹 Kirim data ke server
  const handleSubmit = async () => {
    try {
    if (!selectedMk) {
      alert("Silakan pilih mata kuliah terlebih dahulu!");
      return;
    }

    // Tambahkan validasi agar semua node punya mkId
    const dataToSend = penilaian.map((item) => ({
      ...item,
      mkId: item.mkId || selectedMk,
    }));
    console.log("data yang akan di kirim",dataToSend)

    const response = await axios.post("/api/setUp", dataToSend, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Data terkirim:", response.data);
    alert("Data berhasil dikirim!");
  } catch (err) {
    console.error("❌ Error submit:", err);
    alert("Gagal mengirim data.");
  }
  };

  // 🔹 Komponen recursive untuk render FormBobot dan children
  const renderNode = (node: Penilaian, path: number[]) => (
    <div key={path.join("-")} className="ml-5 mt-5 border-l pl-5 space-y-4">
      <FormBobot
        data={node}
        onChange={(key, val) => handleChange(path, key, val)}
        addSub={() => handleAddChild(path)}
        delSub={() => handleDelChild(path)}
      />
      {node.children.map((child, i) => renderNode(child, [...path, i]))}
    </div>
  );

  useEffect(() => {
    handleGetMatakuliah();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <select className="border p-2 rounded-lg focus:ring-1 focus:ring-blue-900">
        <option value="">--- Pilih Tahun Akademik ---</option>
        {tahunAkademik.map((item) => (
          <option key={item.id} value={item.id}>
            {item.tahun}-{item.semester}
          </option>
        ))}
      </select>

      <select
        className="border p-2 rounded-lg focus:ring-1 focus:ring-blue-900"
        onChange={(e) => setSelectedMk(e.target.value)}
      >
        <option value="">--- Pilih Matakuliah ---</option>
        {mataKuliah.map((mk) => (
          <option key={mk.id_mk} value={mk.id_mk}>
            {mk.kode_mk} - {mk.nama_matakuliah}
          </option>
        ))}
      </select>

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-500">
          Set Up Bobot Penilaian
        </h1>
        <button
          onClick={addRootPenilaian}
          className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg"
        >
          <Plus /> Tambah Komponen
        </button>
      </div>

      <div className="bg-white shadow-lg p-5 rounded-lg">
        {penilaian.map((node, i) => renderNode(node, [i]))}
      </div>

      {penilaian.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-lg self-end"
        >
          Simpan
        </button>
      )}
    </div>
  );
}
