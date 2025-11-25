import CardPenilain from '@/components/CardSetUp'
import Dosen from '@/components/Dosen'
import BobotPenilaian from '@/components/BobotPenilaian'
import React from 'react'
import { useState } from 'react'
import Mahasiswa from '@/components/Mahasiswa'
import Matakuliah from '@/components/Matakuliah'

const colors = [
  "bg-blue-400 text-blue-400",
  "bg-green-400 text-green-800",
  "bg-yellow-400 text-yellow-800",
  "bg-purple-400 text-purple-800",
];

const menuSet =[
  {
    name:"Bobot Penilaian",
    jumlah:"0",
    href:"/admin/bobotPenilaian",  
    tanggal:"10-11-2022"
  },
  {
    name:"Dosen",
    jumlah:"0",
    href:"/admin/dosen",
    tanggal:"10-11-2022"
  },
  {
    name:"Matakuliah",
    jumlah:"0",
    href:"#",
    tanggal:"10-11-2022"
  },
  {
    name:"Mahasiswa",
    jumlah:"0",
    href:"#",
    tanggal:"10-11-2022"
  }
]

export default function SetUp() {
  const [contentActive, setContentActive] = useState("Bobot Penilaian");
  return (
    <div className='flex gap-5 pt-4'>
      <div className='flex flex-col gap-5'>
      {
        menuSet.map((item, index)=>(
          <CardPenilain className={colors[index % colors.length]} key={index} name={item.name} jumlah={item.jumlah} onClick={() => setContentActive(item.name)} tanggal={item.tanggal}/>
        ))
      }
      </div>
      <main className='bg-white w-4xl rounded-xl shadow-lg p-5'>
        {
          contentActive === "Dosen" && <Dosen/>||
          contentActive === "Bobot Penilaian" && <BobotPenilaian/>||
          contentActive === "Matakuliah" && <Matakuliah/>||
          contentActive === "Mahasiswa" && <Mahasiswa/>
        }
        
      
      </main>
    </div>
  )
}
