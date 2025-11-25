import React from "react";
import Sidebar from "../organisms/Sidebar";
import { usePathname } from "next/navigation";

import { House } from "lucide-react";
import Link from "next/link";


type Props = {
  children: React.ReactNode;
  hiddenSideBar?: boolean;
  title?: string;
};

export default function MainLayouts({ children, title, hiddenSideBar }: Props) {
  const pathName = usePathname();

  const path = pathName.replace(/^\//, "").replaceAll("/", " > ");

  return (
    <div>
      {!hiddenSideBar && <Sidebar />}
      <main
        className={`${
          hiddenSideBar ? "" : " p-5 $ ml-52 bg-gray-100 min-h-screen"
        }`}
      >
        {!hiddenSideBar && (
          <div>
            <h1 className="text-2xl font-semibold text-gray-500">{title}</h1>
            <div className="flex gap-3 items-center">
              <Link href={"/admin/dashboard"}>
                <House className="w-5 h-5 text-gray-500 hover:scale-105 transition-all ease-in-out duration-200 hover:cursor-pointer" />
              </Link>
              <h1 className="text-xs font-semibold text-gray-500">{path}</h1>
            </div>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}


