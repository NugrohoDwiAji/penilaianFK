import axios from "axios"

type NilaiItem = { id: string; sumatifId: string; nama: string; nilai: number };
type MahasiswaItem = { nama: string; nim: string; nilai: NilaiItem[] };
type DataSumatifNilai = {
  id_kelas: string;
  nama_kelas: string;
  semester: number;
  thn_akademik: string;
  mahasiswa: MahasiswaItem[];
};

type Matakuliah ={
 id_mk: string;
  kode_mk: string;
  nama_matakuliah: string;
created_at: string;
update_at: string;
}

export const getNilaiKelasMahasiswa = async (id: string, mkId: string, callback: (data?: DataSumatifNilai[] | string )=>void) => {
    try {
        await axios.get(`/api/detail/sumatifNilai`, {params:{id:id, mkId:mkId}}).then((res) => callback(res.data.datas));
    } catch (error) {
        callback("gagal mengambil data");
        console.log(error);
        
    }
}



export const getMatakuliah = async (callback: (status?:boolean ,data?: Matakuliah[] | string)=>void) =>{
    try {
        await axios.get(`/api/matakuliah`).then((res) => callback(true,res.data.datas));
    } catch (error) {
        callback(false,"gagal mengambil data");
        console.log(error);
        
    }
}