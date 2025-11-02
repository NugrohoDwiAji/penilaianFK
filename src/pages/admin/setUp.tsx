import CardPenilain from '@/components/CardSetUp'
import React from 'react'



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
  return (
    <div>
      <div className='grid grid-cols-2 gap-5 w-fit m-auto mt-20'>

      {
        menuSet.map((item, index)=>(
          <CardPenilain key={index} name={item.name} jumlah={item.jumlah} href={item.href} tanggal={item.tanggal}/>
        ))
      }
      </div>
    </div>
  )
}
