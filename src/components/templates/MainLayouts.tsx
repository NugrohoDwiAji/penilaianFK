import React from "react";
import Sidebar from "../organisms/Sidebar";
import { usePathname } from "next/navigation";

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
      <main className={`p-5 ${hiddenSideBar? "" : "ml-52"} bg-gray-100 min-h-screen`}>
        <h1 className="text-2xl font-semibold text-gray-500">{title}</h1>
        {!hiddenSideBar &&  <h1 className="text-xs font-semibold text-gray-500">{path}</h1>}
       
        {children}
        </main>
    </div>
  );
}
