import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import TipeKelas from "@/components/datas/tipeKelas.json";
import { useCallback } from "react";

type Props = {
  onClick: () => void;
  mataKuliah: string;
  kurikulum: string;
  mkId: string;
};

type DataDosen = {
  id_dosen: string;
  nama_dosen: string;
  nik: string;
  is_online: boolean;
  created_at: string;
  upate_at: string;
};

type DataMhs = {
  id: string;
  nama: string;
  nim: string;
  created_at: string;
  upate_at: string;
};

type DataPost = {
  nama_kelas: string;
  mkId: string;
  semester: number;
  tahun_akademik: string;
  dosen: string;
  sumatifPersen: string
  mahasiswa:{nim: string}[];
};

type DataSumatif = {
  id:string;
  nama:string;
  parentId:string|null;
  children:DataSumatif[]
}

const dataSemester = [1, 2, 3, 4, 5, 6, 7, 8];
export default function FlyerKelas({ onClick, mataKuliah, kurikulum, mkId }: Props) {
  const [isDosen, setIsDosen] = useState(true);
  const [dataDosen, setDataDosen] = useState<DataDosen[]>([]);
  const [dataMhs, setDataMhs] = useState<DataMhs[]>([]);
  const [dataSumatif, setDataSumatif] = useState<DataSumatif []>([])
  const [namaKelasFirst, setNamaKelasFirst] = useState("")
  const [namaKelasSecond, setNamaKelasSecond] = useState("")

  const [selectedDosen, setSelectedDosen] = useState<string[]>([]);
  const [selectedMhs, setSelectedMhs] = useState<string[]>([]);

  const [viewPerPage, setviewPerPage] = useState(5);
  const [currentPage, setcurrentPage] = useState(1);

  const [dataPost, setdataPost] = useState<DataPost>({
    nama_kelas: "",
    mkId: mkId,
    semester: 0,
    tahun_akademik: kurikulum,
    dosen: "",
    sumatifPersen: "",
    mahasiswa: []
    
  });

  // pagenation logic Dosen

  const startIndexDosen = (currentPage - 1) * viewPerPage;
  const endIndexDosen = startIndexDosen + viewPerPage;
  const currentDataDosen = dataDosen.slice(startIndexDosen, endIndexDosen);

  // pagenation logic Mahasiswa

  const startIndexMhs = (currentPage - 1) * viewPerPage;
  const endIndexMhs = startIndexMhs + viewPerPage;
  const currentDataMhs = dataMhs.slice(startIndexMhs, endIndexMhs);

  const handleGetDosen = async () => {
    try {
      const result = await axios.get("/api/dosen");
      setDataDosen(result.data.datas);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCheckbox = (id: string, type: "dosen" | "mhs") => {
    if (type === "dosen") {
      setSelectedDosen((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
      setdataPost((prev) => ({
        ...prev,
        dosen: selectedDosen.includes(id) ? "" : id,
      }))
    } else {
      setSelectedMhs((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
      setdataPost((prev) => ({
        ...prev,
        mahasiswa: selectedMhs.includes(id)
          ? prev.mahasiswa.filter((x) => x.nim !== id)
          : [...prev.mahasiswa, { nim: id }],
      }))
    }
  };

  const handleGetDataSumatif = useCallback(async () => {
    try {
    await axios.get(`/api/sumatifPersen?mkId=${mkId}`).then((res) => setDataSumatif(res.data.datas));
    } catch (error) {
      alert("Gagal mengambil data.");
      console.log(error);
    }
  },[mkId]);

  const handleGetDataMhs = useCallback(async () => {
    try {
      const result = await axios.get(`/api/detail/mahasiswa?id=${mkId}`);
      setDataMhs(result.data.datas);
    } catch (error) {
      console.log(error);
    }
  },[mkId]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      await axios.post("/api/kelas", dataPost);
      alert("Data berhasil dikirim!");
      document.location.reload();
    } catch (error) {
      alert("Gagal mengirim data.");
      console.log(error)
    }
  };


  // membentuk nama kelas

  const updateNamaKelas =(a:string, b:string) => {
    let nama= "";
    if (a && b) nama = a + "-" + b;
    else if (a) nama = a;
    else if (b) nama = b;
    setdataPost((prev) => ({
      ...prev,
      nama_kelas: nama,
    }));

  }

  const handleSelectA = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNamaKelasFirst(e.target.selectedOptions[0].text);
    updateNamaKelas(e.target.selectedOptions[0].text, namaKelasSecond);
  };

  const handleSelectB = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNamaKelasSecond(e.target.selectedOptions[0].text);
    updateNamaKelas(namaKelasFirst, e.target.selectedOptions[0].text);
  };


  // fungsi untuk menentukan data mana yang akan dirender
  const getRenderableData = (items: DataSumatif[]): DataSumatif [] => {
    const hasil: DataSumatif[] = [];
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        hasil.push(...item.children); // render children-nya
      } else {
       return hasil; // jika tidak punya children, render parentnya
      }
    }
    return hasil;
  };

  useEffect(() => {
    handleGetDosen();
    handleGetDataMhs();
    handleGetDataSumatif();
  }, [handleGetDataMhs, handleGetDataSumatif]);

  const renderDataSumatif = getRenderableData(dataSumatif);


  return (
    <div className="w-3xl min-h-52 bg-white absolute p-5 shadow-2xl rounded-lg">
      <div className="p-2 bg-red-400/50 w-fit rounded-full text-red-600 relative top-0 right-0 cursor-pointer">
        <X onClick={onClick} />
      </div>
      <form action="" className="flex flex-col gap-10">
        <div className="flex gap-10">
          <div className="flex gap-4 items-center">
            <label htmlFor="">Nama Kelas</label>
            <select name="" id=""  onChange={(e) => {
                setdataPost({
                  ...dataPost,
                  sumatifPersen: e.target.value,
                });
                handleSelectA(e);
              }} className="border border-gray-400 p-2 rounded-lg outline-none active:outline-none focus:outline-none focus:ring-2 focus:ring-blue-400/40 ">
              <option value=""> --- Pilih Kelas --- </option>
              <option value="nonBlok">Non Blok</option>
              {renderDataSumatif.map((item) => (
                <option value={item?.id} key={item?.id} className="">{item?.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="">Tipe Kelas</label>
            <select name="" id="" onChange={handleSelectB}>
              <option value="">--- Tipe ---</option>
              {TipeKelas.map((item) => (
                <option value={item.nama} key={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 items-center">
            <label htmlFor="">Matakuliah</label>
            <input
              type="text"
              name=""
              id=""
              value={mataKuliah}
              className="border border-gray-400 p-2 rounded-lg bg-gray-200/40 outline-none active:outline-none focus:outline-none text-gray-700 "
              readOnly={true}
            />
          </div>
        </div>
        <div className="flex justify-evenly">
          <div className="flex gap-4 items-center">
            <label htmlFor="">semester</label>
            <select
              onChange={(e) =>
                setdataPost({ ...dataPost, semester: Number(e.target.value) })
              }
            >
              <option value="">Pilih Semester</option>
              {dataSemester.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-1 rounded-sm cursor-pointer hover:border-2 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg hover:bg-white ease-in-out duration-300 transition-all">Submit</button>
        </div>

        <div className="flex bg-gray-200 w-fit p-1 rounded-full m-auto ">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsDosen(!isDosen);
            }}
            className={`py-2 px-8 rounded-full ease-in-out duration-300 transition-all font-semibold cursor-pointer ${
              isDosen ? "text-gray-500" : "bg-white"
            }`}
          >
            Mahasiswa
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsDosen(!isDosen);
            }}
            className={`py-2 px-8 rounded-full ease-in-out duration-300 transition-all font-semibold cursor-pointer  ${
              isDosen ? "bg-white" : "text-gray-500"
            }`}
          >
            Dosen
          </button>
        </div>
        {isDosen ? (
          <div>
            <table className="w-full ">
              <thead>
                <tr>
                  <th>Pilih</th>
                  <th>No</th>
                  <th>Nik/Nip</th>
                  <th>Nama Dosen</th>
                </tr>
              </thead>
              <tbody>
                {currentDataDosen.slice(0, viewPerPage).map((dosen, index) => (
                  <tr
                    key={dosen.id_dosen}
                    className="text-gray-800 border-y-2 border-gray-400/30"
                  >
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        checked={selectedDosen.includes(dosen.id_dosen)}
                        onChange={() => toggleCheckbox(dosen.id_dosen, "dosen")}
                      />
                    </td>
                    <td className="text-center px-5">
                      {startIndexDosen + index + 1}
                    </td>
                    <td className="text-center h-12">
                      <span
                        className={`text-center ${
                          Number(dosen.nik.slice(-1)) % 2 === 0
                            ? "bg-blue-400/50 rounded-full px-2 py-1 "
                            : "bg-green-400/50 rounded-full px-2 py-1"
                        }`}
                      >
                        {dosen.nik}
                      </span>
                    </td>
                    <td className="text-center">{dosen.nama_dosen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer className="bg-white w-full h-14 rounded-b-lg border-b-2 border-x-2  border-gray-400/30 flex justify-end px-5">
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setcurrentPage(currentPage - 1);
                  }}
                >
                  <ChevronLeft className="h-4 w-4 text-blue-500 cursor-pointer  " />
                </button>
                {[...Array(Math.ceil(dataDosen.length / viewPerPage))].map(
                  (_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === Math.ceil(dataDosen.length / viewPerPage) ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={(e) => {
                            e.preventDefault();
                            setcurrentPage(page);
                          }}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-blue-600 hover:bg-purple-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return <button key={page}>...</button>;
                    } else {
                      return null;
                    }
                  }
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setcurrentPage(currentPage + 1);
                  }}
                >
                  <ChevronRight className="h-4 w-4 text-blue-500 cursor-pointer" />
                </button>
              </div>
            </footer>
          </div>
        ) : (
          <div>
            <table className="w-full ">
              <thead>
                <tr>
                  <th>Pilih</th>
                  <th>No</th>
                  <th>Nim</th>
                  <th>Nama Mahasiswa</th>
                </tr>
              </thead>
              <tbody>
                {currentDataMhs.slice(0, viewPerPage).map((mhs, index) => (
                  <tr
                    key={mhs.nim}
                    className="text-gray-800 border-y-2 border-gray-400/30"
                  >
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        checked={selectedMhs.includes(mhs.nim)}
                        onChange={() => toggleCheckbox(mhs.nim, "mhs")}
                      />
                    </td>
                    <td className="text-center">{startIndexMhs + index + 1}</td>
                    <td className="text-center h-12 ">
                      <span
                        className={`text-center ${
                          Number(mhs.nim.slice(-1)) % 2 === 0
                            ? "bg-blue-400/50 rounded-full px-2 py-1 "
                            : "bg-green-400/50 rounded-full px-2 py-1"
                        }`}
                      >
                        {mhs.nim}
                      </span>
                    </td>
                    <td className="text-center">{mhs.nama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer className="bg-white w-full h-16 rounded-b-lg border-b-2 border-x-2  border-gray-400/30 flex justify-end px-5">
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setcurrentPage(currentPage - 1);
                  }}
                >
                  <ChevronLeft className="h-4 w-4 text-blue-500 cursor-pointer  " />
                </button>
                {[...Array(Math.ceil(dataMhs.length / viewPerPage))].map(
                  (_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === Math.ceil(dataMhs.length / viewPerPage) ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={(e) => {
                            e.preventDefault();
                            setcurrentPage(page);
                          }}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-blue-600 hover:bg-purple-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return <button key={page}>...</button>;
                    } else {
                      return null;
                    }
                  }
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setcurrentPage(currentPage + 1);
                  }}
                >
                  <ChevronRight className="h-4 w-4 text-blue-500 cursor-pointer" />
                </button>
              </div>
            </footer>
          </div>
        )}
      </form>
    </div>
  );
}
