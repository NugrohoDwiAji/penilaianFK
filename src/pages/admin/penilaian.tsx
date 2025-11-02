"use client";
import CardKelas from "@/components/CardKelas";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type DataKelas = {
  id_kelas: string;
  nama_kelas: string;
  created_at: Date;
  mkId: string;
  thn_akademik: string;
  matakuliah: {
    nama_matakuliah: string;
  };
  KelasDosen: [
    {
      dosenId: string;
      dosen: {
        nama_dosen: string;
        nik: string;
      };
    }
  ];
  KelasMahasiswa: [
    {
      id_kelas_mahasiswa: string;
      krsDetailId: string;
      created_at: Date;
      KrsDetail: {
        id_krs_detail: string;
        krsId: string;
        created_at: Date;
        krs: {
          id_krs: string;
          nim: string;
          created_at: Date;
          mahasiswa: {
            id_mhs: string;
            nama_mhs: string;
            nim: string;
            created_at: Date;
          };
        };
      };
      KhsDetail: [
        {
          id_khs_detail: string;
          nilai: 0;
          created_at: Date;
        }
      ];
    }
  ];
  sumatifPersen: {
    id: string;
    nama: string;
    bobot: number;
  };
};

type DataMk = {
  id_mk: string;
  kode_mk: string;
  nama_matakuliah: string;
};

export default function Penilaian() {
  const [daftarKelas, setDaftarKelas] = useState<DataKelas[]>([]);
  const [matakuliah, setMatakuliah] = useState<DataMk[]>([]);

  const router = useRouter();

  const handleGetKelas = async (mkId: string) => {
    console.log(mkId);
    try {
      await axios
        .get(`/api/detail/kelasDetail?mkId=${mkId}`)
        .then((res) => setDaftarKelas(res.data.datas));
    } catch (error) {
      alert("Gagal mengambil data.");
      console.log(error);
    }
  };

  const handleGetMatakuliah = async () => {
    try {
      await axios
        .get(`/api/matakuliah`)
        .then((res) => setMatakuliah(res.data.datas));
    } catch (error) {
      alert("Gagal mengambil data.");
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetMatakuliah();
  }, []);

  return (
    <div className="p-5 ">
      <div className="bg-white p-5 rounded-xl">
        <div className="gap-2 flex items-center">
          <label htmlFor="">Pilih Matakuliah</label>
          <select
            onChange={(e) => {
              handleGetKelas(e.target.value);
            }}
            name=""
            id=""
            className="ring-2 rounded-sm p-2 ring-gray-400/30 focus:outline-none focus:ring-blue-500 cursor-pointer"
          >
            <option value="">---Pilih Matakuliah---</option>
            {matakuliah.map((mk) => (
              <option key={mk.id_mk} value={mk.id_mk}>
                {mk.nama_matakuliah}
              </option>
            ))}
          </select>
        </div>
      </div>
      <h1 className="w-fit px-8 py-2 bg-blue-600 shadow-lg  rounded-lg my-5 text-white font-semibold ">Daftar Kelas</h1>
      {daftarKelas.length === 0 ? (
        <h1 className="text-center text-4xl text-gray-400 mt-44">Belum Ada Kelas</h1>
      ) : (
        <div className="flex flex-wrap gap-4">
          {daftarKelas.map((kelas) => (
            <CardKelas
              key={kelas.id_kelas}
              idKelas={kelas.id_kelas}
              namaKelas={kelas.nama_kelas}
              namaDosen={kelas.KelasDosen[0].dosen.nama_dosen}
              nikDosen={kelas.KelasDosen[0].dosen.nik}
              tanggal={kelas.sumatifPersen.nama}
              isDelete={true}
              isEdit={() => router.push(`/detail/${kelas.nama_kelas}/${kelas.mkId}/${kelas.sumatifPersen.id}/`)}
              isSee={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
