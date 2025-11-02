"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Pen, Trash2, Save } from "lucide-react";

function toPascalCase(text: string): string {
  return text
    .split("-") // pisahkan berdasarkan tanda "-"
    .map(part =>
      part
        .split(" ") // pisahkan kata di dalamnya
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("") // gabung kata tanpa spasi
    )
    .join("-"); // gabung kembali dengan tanda "-"
}

const colors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
];

type DataSumatifNilai = {
  nama_kelas: string;
  semester: number;
  thn_akademik: string;
  KelasMahasiswa: [
    {
      KrsDetail: {
        KhsDetail: [{ nilai: number; id: string }];
        krs: { mahasiswa: { nim: string; nama_mhs: string } };
      };
    }
  ];
};

type DataKomponen = { id: string; nama: string; bobot: number };

export default function TabelPenilaian() {
  const router = useRouter();
  const { nama,mkId, id } = router.query;
  const [dataNilai, setdataNilai] = useState<DataSumatifNilai[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [nilai, setNilai] = useState<{ [key: string]: number }>({});
  const [komonenPenilaian, setKomonenPenilaian] = useState<DataKomponen[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  function capitalizeWords(text: string) {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const handleGetKomponen = async () => {
    if (router.isReady) {
      try {
        await axios
          .get(`/api/detail/sumatifPersenDetail?id=${id}`)
          .then((res) => setKomonenPenilaian(res.data.datas));
      } catch (error) {
        alert("Gagal mengambil data.");
        console.log(error);
      }
    }
  };

  const handleGetItemSumatif = async (id: string) => {
    if (router.isReady) {
      try {
        await axios
          .get(`/api/detail/sumatifNilai?id=${id}`)
          .then((res) => setdataNilai(res.data.datas));
      } catch (error) {
        alert("Gagal mengambil data.");
        console.log(error);
      }
    }
  };

  // Fungsi untuk menyimpan semua nilai
  const handleSaveAllNilai = async () => {
    setIsSaving(true);
    
    // Susun data dalam format JSON
    const dataToSave = dataNilai[0]?.KelasMahasiswa.map((item, index) => {
      const nim = item.KrsDetail.krs.mahasiswa.nim;
      const namaMhs = item.KrsDetail.krs.mahasiswa.nama_mhs;
      
      // Ambil nilai untuk setiap komponen penilaian
      const nilaiPerKomponen = komonenPenilaian.map((komponen, i) => ({
        komponen_id: komponen.id,
        komponen_nama: komponen.nama,
        nilai: nilai[`${index}-${i}`] ?? item.KrsDetail.KhsDetail[0]?.nilai ?? 0,
        khs_detail_id: item.KrsDetail.KhsDetail[0]?.id
      }));

      return {
        nim: nim,
        nama_mahasiswa: namaMhs,
        mkId: mkId,
        sumatif_id: id,
        nilai_komponen: nilaiPerKomponen
      };
    });

    console.log("Data yang akan disimpan:", JSON.stringify(dataToSave, null, 2));

    try {
      // Kirim ke API
       await axios.put('/api/penilaian', {
        data_nilai: dataToSave
      });
      
      alert("Data berhasil disimpan!");
      setIsEditMode(false);
      setNilai({});
      
      // Refresh data
      handleGetItemSumatif(id as string);
    } catch (error) {
      alert("Gagal menyimpan data.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (router.isReady && id) {
      handleGetItemSumatif(id as string);
      handleGetKomponen();
    }
  }, [router.isReady, id]);

  return (
    <div className="mt-10">
      {dataNilai ? (
        <div className="p-10 bg-white shadow-lg w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Penilaian {toPascalCase(nama as string)}</h2>
            <div className="flex gap-2">
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
                {komonenPenilaian.map((item, i) => (
                  <th className="px-4" key={i}>
                    {item.nama}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataNilai[0]?.KelasMahasiswa.map((item, index) => {
                const colorClass = colors[index % colors.length];
                return (
                  <tr
                    key={index}
                    className="border-b-2 border-gray-100 text-gray-700 text-base"
                  >
                    <td className="p-2 text-center">{index + 1}</td>
                    <td>
                      <h1
                        className={`w-fit h-fit py-1 px-3 text-xs rounded-full font-semibold ${colorClass}`}
                      >
                        {item.KrsDetail.krs.mahasiswa.nim}
                      </h1>
                    </td>
                    <td>
                      {capitalizeWords(item.KrsDetail.krs.mahasiswa.nama_mhs)}
                    </td>
                    {komonenPenilaian.map((items, i) => {
                      const currentValue = nilai[`${index}-${i}`] ?? item.KrsDetail.KhsDetail[0]?.nilai ?? 0;
                      return (
                        <td key={i} className="p-2 text-center">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={currentValue}
                              onChange={(e) =>
                                setNilai({
                                  ...nilai,
                                  [`${index}-${i}`]: Number(e.target.value),
                                })
                              }
                              className="border border-gray-300 rounded p-1 w-16 text-center"
                              min="0"
                              max="100"
                            />
                          ) : (
                            currentValue
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <h1>Memuat data...</h1>
      )}
    </div>
  );
}