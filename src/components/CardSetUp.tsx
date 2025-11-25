import React from "react";
import { ArrowRightFromLine } from "lucide-react";


type Props = {
  name:string;
  jumlah:string;
  tanggal:string
  className?:string
  onClick:()=>void
};

export default function CardPenilain({
  name,
  jumlah,
  tanggal,
  onClick,
  className,
}: Props) {
  return (
    <div className={`h-28 w-72  shadow-lg text-gray-700 rounded-t-xl rounded-b-2xl pt-1 ${className}`}>
      <div className="bg-white rounded-t-lg rounded-b-xl h-full w-full flex flex-col justify-between p-2">
        <h1>{name}</h1>
        <h1 className="font-bold text-lg">{jumlah}</h1>
        <div className="flex justify-between items-end">
          <p className="text-sm">{tanggal}</p>
          <button
            onClick={onClick}
            className="bg-green-300/30 p-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all ease-in-out duration-200 hover:cursor-pointer"
          >
            <ArrowRightFromLine size={20} className="text-green-600 "/>
          </button>
        </div>
      </div>
    </div>
  );
}
