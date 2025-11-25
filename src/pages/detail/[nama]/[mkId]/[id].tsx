"use client";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Pen, Save } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";


const colors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
];

type DataKomponen = { id: string; nama: string; bobot: number };
type NilaiItem = { id: string; sumatifId: string; nama: string; nilai: number };
type MahasiswaItem = { nama: string; nim: string; nilai: NilaiItem[] };
type DataSumatifNilai = {
  id_kelas: string;
  nama_kelas: string;
  semester: number;
  thn_akademik: string;
  mahasiswa: MahasiswaItem[];
};

function capitalizeWords(text: string) {
  if (!text) return "";
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}



// ✅ Komponen Baris Dipisah & Di-Memo
const TableRow = React.memo(
  ({
    item,
    index,
    isEditMode,
    handleChangeNilai,
    nilaiState,
  }: {
    item: MahasiswaItem;
    index: number;
    isEditMode: boolean;
    handleChangeNilai: (key: string, val: number) => void;
    nilaiState: { [key: string]: number };
  }) => {
    const colorClass = colors[index % colors.length];
    return (
      <tr className="border-b-2 border-gray-100 text-gray-700 text-base">
        <td className="p-2 text-center">{index + 1}</td>
        <td>
          <h1
            className={`w-fit h-fit py-1 px-3 text-xs rounded-full font-semibold ${colorClass}`}
          >
            {item.nim}
          </h1>
        </td>
        <td>{capitalizeWords(item.nama)}</td>
        {item.nilai.map((n, i) => {
          const key = `${index}-${i}`;
          const currentValue = nilaiState[key] ?? n.nilai;
          return (
            <td key={i} className="p-2 text-center">
              {isEditMode ? (
                <input
                  type="number"
                  value={currentValue}
                  min="0"
                  max="100"
                  onChange={(e) =>
                    handleChangeNilai(key, Number(e.target.value))
                  }
                  className="border border-gray-300 rounded p-1 w-16 text-center"
                />
              ) : (
                currentValue
              )}
            </td>
          );
        })}
      </tr>
    );
  }
);

TableRow.displayName = "TableRow";

export default function TabelPenilaian() {
  const router = useRouter();
  const { mkId, id } = router.query;

  const [dataNilai, setDataNilai] = useState<DataSumatifNilai[]>([]);
  const [komponenPenilaian, setKomponenPenilaian] = useState<DataKomponen[]>([]);
  const [nilai, setNilai] = useState<{ [key: string]: number }>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Gunakan useCallback biasa untuk state update
  const handleChangeNilaiImmediate = useCallback((key: string, val: number) => {
    setNilai((prev) => ({ ...prev, [key]: val }));
  }, []);

  // ✅ Debounce hanya untuk operasi yang mahal (opsional)
  const handleChangeNilai = useDebouncedCallback(
    handleChangeNilaiImmediate,
    150
  );

  const fetchData = useCallback(async (sumatifId: string) => {
    try {
      setIsLoading(true);
      const [nilaiRes, komponenRes] = await Promise.all([
        axios.get(`/api/detail/sumatifNilai`, {params:{id:sumatifId, mkId:mkId}}),
        axios.get(`/api/detail/sumatifPersenDetail`, {params:{id:sumatifId, mkId:mkId}}),
      ]);
      setDataNilai(nilaiRes.data.datas);
      setKomponenPenilaian(komponenRes.data.datas);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [mkId]);

  const handleSaveAllNilai = async () => {
    if (!dataNilai[0]) return;
    setIsSaving(true);

    const dataToSave = dataNilai[0].mahasiswa.map((mhs, index) => ({
      nim: mhs.nim,
      nama_mahasiswa: mhs.nama,
      mkId,
      sumatif_id: id,
      nilai_komponen: dataNilai[0].mahasiswa[0].nilai.map((komponen, i) => ({
        komponen_id: komponen.sumatifId,
        komponen_nama: komponen.nama,
        nilai: nilai[`${index}-${i}`] ?? mhs.nilai[i]?.nilai ?? 0,
        khs_detail_id: mhs.nilai[i]?.id,
      })),
    }));



    try {
      await axios.put("/api/penilaian", { data_nilai: dataToSave });
      alert("Data berhasil disimpan!");
      setIsEditMode(false);
      setNilai({});
      if (id) fetchData(id as string);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

const handleDownloadNilai = async () => {
  try {
    await axios.get(`/api/pdf/route`, {params:{id:id, mkId:mkId}});
  } catch (error) {
    console.log(error)
  }
}

  useEffect(() => {
    if (router.isReady && id) {
      fetchData(id as string);
    }
  }, [router.isReady, id, fetchData]);

  if (isLoading) return <h1 className="text-gray-500">Memuat data...</h1>;
  console.log("ini data nilai", dataNilai)

  return (
    <div className="mt-10">
      <div className="p-10 bg-white shadow-lg w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Penilaian Mahasiswa
          </h2>
          <div className="flex gap-2">
            {!isEditMode && (
              <button className="bg-blue-500 cursor-pointer" onClick={handleDownloadNilai}>
                Pdf
              </button>
            )}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                isEditMode
                  ? "bg-gray-500 hover:bg-gray-600 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              <Pen className="h-5 w-5" />
              {isEditMode ? "Batal Edit" : "Edit Semua"}
            </button>
            {isEditMode && (
              <button
                onClick={handleSaveAllNilai}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {isSaving ? "Menyimpan..." : "Simpan Semua"}
              </button>
            )}
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-500 font-normal">
              <th className="pt-2 px-4">No</th>
              <th className="px-4">NIM</th>
              <th className="px-4">Nama Mahasiswa</th>
              {dataNilai[0]?.mahasiswa[0].nilai.map((item, i) => (
                <th className="px-4" key={i}>
                  {item.nama}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataNilai[0]?.mahasiswa.map((item, index) => (
              <TableRow
                key={item.nim}
                item={item}
                index={index}
                isEditMode={isEditMode}
                handleChangeNilai={handleChangeNilai}
                nilaiState={nilai}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}