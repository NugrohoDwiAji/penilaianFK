import Image from "next/image";
import React from "react";
import {
  House,
  SlidersHorizontal,
  FileText,
  FilePen,
  Landmark,
  CircleUserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const menu = [
  {
    title: "Dashboard",
    icon: <House size={20} />,
    link: "/admin/dashboard",
  },
  {
    title: "Kurikulum",
    icon: <FileText size={20} />,
    link: "/admin/kurikulum",
  },
  {
    title: "Set Up ",
    icon: <SlidersHorizontal size={20} />,
    link: "/admin/setUp",
  },
  {
    title: "Kelas",
    icon: <Landmark size={20} />,
    link: "/admin/kelas",
  },
  {
    title: "Penilaian",
    icon: <FilePen size={20} />,
    link: "/admin/penilaian",
  },
];

export default function Sidebar() {
  const [isActive, setisActive] = useState(false);
  const { data: session } = useSession();

  async function handleSignOut() {
    await signOut({ callbackUrl: "/login" });
  }

  const pathname = usePathname();

  return (
    <div className="bg-white fixed top-0 left-0 bottom-0 w-52 shadow-lg flex flex-col justify-between">
      <div>
      <div className="flex justify-between items-center px-3 pt-5">
        <div className="">
          <Image
            src="/img/ubg.png"
            width={40}
            height={40}
            alt="logo"
            className=""
          />
        </div>
      </div>
      <div className="px-2 pt- w-full ">
        <h1 className="text-gray-400 text-xs font-semibold">NAVIGATION</h1>
        <div
          className={` rounded-lg px-1 ${
            isActive ? "text-gray-900" : "text-gray-500"
          } flex flex-col `}
        >
          {menu.map((item) => (
            <div key={item.title}>
              <Link
                href={item.link}
                key={item.title}
                className={`flex font-semibold text-sm items-center px-2 py-1 my-1 transition-all ease-in-out duration-300 hover:cursor-pointer hover:scale-110 hover:shadow-lg hover:bg-gray-200 hover:text-gray-900 hover:rounded-lg ${
                  pathname === item.link
                    ? "text-gray-900 bg-gray-200 rounded-lg "
                    : "text-gray-500"
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
        <div className="">
          <div className="flex justify-between px-3">

          <button className="text-sm text-gray-700 border rounded-full bg-gray-100 border-gray-400 h-8 w-8">?</button>
          <button className="bg-gray-100 border-gray-400 border text-gray-700 text-sm font-semibold w-fit px-5 py-1 rounded-full mb-2 hover:scale-110 hover:shadow-lg hover:cursor-pointer ease-in-out transition-all duration-300" onClick={handleSignOut}>Sign Out</button>
          </div>
          <div className="flex items-center gap-2 text-gray-400 border-t px-5 py-3 w-full ">
            <CircleUserRound size={32} />
            <h1 className="text-[10px] flex flex-col ">
              <section className="text-sm text-gray-800 ">

              {session?.user?.name}
              </section>
            {session?.user?.email}
            </h1>
          </div>
        </div>
    </div>
  );
}
