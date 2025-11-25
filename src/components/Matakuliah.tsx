import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import TableMk from './organisms/TabelMk';
import { getMatakuliah } from '@/services/getData';

interface Data {
  id_mk: string;
  kode_mk: string;
  nama_matakuliah: string;
}

export default function Matakuliah() {
 const [dataMatakuliah, setDataMatakuliah] = useState<Data[]>([]);
  const [isSpin, setisSpin] = useState(false);


  const handleGetDosen = async () => {
    try {
      await getMatakuliah((status, data) => {
        if (status && Array.isArray(data)) {
          setDataMatakuliah(data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetDosen();
  }, []);

  return (
    <div className="">
      <div className="bg-white p-5 w-fit rounded-xl">
        <div className="flex justify-between items-center mb-7">
          <div>
            <input
              type="text"
              className="ring-2 ring-blue-200 p-1 rounded-lg outline-none text-gray-700 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              placeholder="search"
            />
          </div>
          <div>
            <button
              onClick={() => setisSpin(!isSpin)}
              className={`flex gap-2 items-center text-blue-800 font-semibold bg-blue-400/30 py-1 px-4 rounded-lg shadow-md hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer `}
            >
              sync
              <RefreshCw
                className={isSpin ? "animate-spin" : ""}
                strokeWidth={3}
              />
            </button>
          </div>
        </div>
        <TableMk data={dataMatakuliah} />
      </div>
    </div>
  );
}
