import React from "react";
import { GraduationCap, Pen, Trash2, Eye } from "lucide-react";
import axios from "axios";

type props = {
    idKelas: string
    namaKelas: string
namaDosen: string
nikDosen: string
tanggal: string
isDelete?: boolean
isEdit:()=>void
isSee:()=>void
}



export default function CardKelas({
  idKelas,
  namaKelas,
  namaDosen,
  nikDosen,
  tanggal,
  isDelete,
  isEdit,
  isSee
}: props) {

  const handleDeleteKelas = async (id:string)=>{
    try {
      await axios.delete(`/api/kelas?id=${id}`);
      alert("Data berhasil dihapus!");
        document.location.reload();
    } catch (error) {
      alert("Gagal menghapus data.");
      console.log(error)
    }
  }



  return (
    <div className={`bg-gradient-to-b from-purple-700/50 to-purple-200/80 px-1 pt-1 pb-8 rounded-2xl w-xs h-40 shadow-md`}>
      <div className="w-full h-full rounded-xl bg-white text-gray-800 p-2">
        <section className="flex gap-2 items-center">
          <GraduationCap className="w-6 h-6 text-purple-600" />
          <h1
            className="font-semibold text-sm
           "
          >
            {namaKelas}
          </h1>
        </section>
        <div className="text-center leading-4 mt-1 mb-2">
          <h1 className="font-bold">{namaDosen}</h1>
          <h2 className="text-xs">{nikDosen}</h2>
        </div>
        <div className="flex justify-center gap-5 ">
          <button onClick={isSee} className="bg-green-500/30 p-1 rounded-lg cursor-pointer hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out">
            <Eye className="text-green-500 h-6 w-6" />
          </button>
          <button onClick={isEdit} className="bg-yellow-500/30 p-1 rounded-lg cursor-pointer hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out">
            <Pen className="text-yellow-500 h-6 w-6" />
          </button>
          <button hidden={isDelete} onClick={()=>handleDeleteKelas(idKelas)} className="bg-red-500/30 p-1 rounded-lg cursor-pointer hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out">
            <Trash2 className="text-red-500 h-6 w-6" />
          </button>
        </div>
      </div>
      <h1 className="text-purple-900 font-semibold text-sm text-center mt-1">
        {tanggal}
      </h1>
    </div>
  );
}
