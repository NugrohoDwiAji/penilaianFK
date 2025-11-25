import { useState } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

type Item = {
  nama_mhs: string;
  nim: string;
  id_mhs: string;
};
type Props = {
  data: Item[];
};
const colors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
];

function capitalizeWords(text: string) {
  if (!text) return "";
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function TableMhs({ data }: Props) {
  const [viewPerPage, setviewPerPage] = useState(5);
  const [currentPage, setcurrentPage] = useState(1);

  const handleDelete = (id: string) => {
    console.log(id);
  };

  const startIndex = (currentPage - 1) * viewPerPage;
  const endIndex = startIndex + viewPerPage;
  const currentData = data.slice(startIndex, endIndex);
  

  return (
    <div>
      <header className="mb-2 flex gap-10 items-end">
        <select
          name=""
          id=""
          onChange={(e) => setviewPerPage(Number(e.target.value))}
          className="outline-none cursor-pointer py-1 ring-2 ring-blue-200 focus:ring-blue-500 rounded-lg"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        <div className="flex gap-2 text-sm text-gray-500">
          <h1>Jumlah Dosen : {data.length}</h1>
          <h1>
            Halaman {currentPage} dari {Math.ceil(data.length / viewPerPage)}{" "}
          </h1>
        </div>
      </header>
      <table className="">
        <thead>
          <tr className="border-y border-gray-200 text-gray-500">
            <th className="py-1 px-4 font-semibold text-sm">No</th>
            <th className="font-semibold text-sm w-xl text-left">Name</th>
            <th className="font-semibold text-sm w-52 text-center">NIM</th>
            <th className="font-semibold text-sm w-40 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentData.slice(0, viewPerPage)?.map((item, index) => (
            <tr
              key={index}
              className="border-y border-gray-200 text-gray-600 text-md "
            >
              <td className="p-1 px-4">{startIndex + index + 1}</td>
              <td>{capitalizeWords(item.nama_mhs)}</td>
              <td className="flex justify-center py-1"> <h1 className={`${colors[index % colors.length] } px-2 h-fit w-fit rounded-lg text-sm `}>{item.nim}</h1></td>
              <td className="">
                <button
                  onClick={() => handleDelete(item.id_mhs)}
                  className="text-red-600 p-1 hover:scale-105 hover:shadow-lg hover:cursor-pointer rounded"
                >
                  <Trash2 className="" size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={()=>{
             const page = currentPage - 1
            const hasil = page < 1 ? Math.ceil(data.length / viewPerPage) : page
            setcurrentPage(hasil)
          }}>
            <ChevronLeft size={20} className="text-gray-600 cursor-pointer" />
          </button>
          {Array.from(
            { length: Math.ceil(data.length / viewPerPage) },
            (_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === Math.ceil(data.length / viewPerPage) ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    className={`px-2 rounded-md cursor-pointer ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600"
                    }`}
                    onClick={() => setcurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 3 || page === currentPage + 3) {
                return <span key={page}>...</span>;
              }
              return null;
            }
          )}
          <button onClick={()=>{
            const page = currentPage + 1
            const hasil = page > Math.ceil(data.length / viewPerPage) ? 1 : page
            setcurrentPage(hasil)}}>
            <ChevronRight size={20} className="text-gray-600 cursor-pointer" />
          </button>
        </div>
      </footer>
    </div>
  );
}
