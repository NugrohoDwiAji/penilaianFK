import Image from "next/image";
import React from "react";
import {
  PanelLeft,
  Box,
  SlidersHorizontal,
  FileText,
  FilePen,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const menu = [
  {
    title: "Dashboard",
    icon: <Box size={20} />,
    link: "/admin/dashboard",
  },
  {
    title: "Set Up ",
    icon: <SlidersHorizontal size={20} />,
    link: "/admin/setUp",
  },
  {
    title: "Kurikulum",
    icon: <FileText size={20} />,
    link: "/admin/kurikulum",
  },
  {
    title: "Penilaian",
    icon: <FilePen size={20} />,
    link: "/admin/penilaian",
  },
  {
    title: "Kelas",
    icon: <Landmark size={20} />,
    link: "/admin/kelas",
    // subMenu: [
    //   {
    //     title: "Kelas",
    //     icon: <Landmark size={20} />,
    //     link: "#",
    //   },
    //   {
    //     title: "Kelas Mahasiswa",
    //     icon: <Landmark size={20} />,
    //     link: "#",
    //   },
    //   {
    //     title: "Kelas Dosen",
    //     icon: <Landmark size={20} />,
    //     link: "#",
    //   },
    // ],
  },
];

export default function Sidebar() {
  const [isActive, setisActive] = useState(false);
  const [subMenuIsOpen, setSubMenuIsOpen] = useState(true);

  return (
    <div className="bg-white fixed top-0 left-0 bottom-0 w-52">
      <div className="flex justify-between items-center px-3 pt-5">
        <div className="ml-5">
          <Image
            src="/img/sipfk.png"
            width={60}
            height={60}
            alt="logo"
            className=""
          />
        </div>
        <div className="text-gray-400">
          <PanelLeft size={32} />
        </div>
      </div>
      <div className="px-6 pt-5 w-full ">
        <h1 className="text-gray-600">Main</h1>
        <div
          className={`py-2 rounded-lg px-2 ${
            isActive ? "text-gray-900" : "text-gray-500"
          } flex flex-col gap-4 `}
        >
          {menu.map((item) => (
            <div key={item.title}>
              <Link
                href={item.link}
                key={item.title}
                className={`flex gap-2 font-semibold text-sm items-center ${
                  item.title == "Kelas" ? "flex-col items-start" : ""
                }`}
              >
                <section className="flex gap-2">
                  {item.icon}
                  {item.title}
                </section>
              </Link>
              {/* <div className={`flex flex-col gap-2 ml-7 ${item.title == "Kelas" ? "mt-2" : ""}`}>
                {subMenuIsOpen &&
                  item.subMenu?.map((subItem) => (
                    <Link
                      href={subItem.link}
                      key={subItem.title}
                      className="flex gap-2 font-semibold text-sm items-start "
                    >
                      
                      ●
                      {subItem.title}
                    </Link>
                  ))}
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
