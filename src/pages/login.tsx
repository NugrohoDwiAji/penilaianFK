import React from "react";
import { UserRound, Lock } from "lucide-react";
import Image from "next/image";

export default function Login() {
  return (
    <div className="bg-blue-900 h-screen w-screen relative  md:flex md:items-center md:justify-center">
      <div className="text-white p-5 md:hidden">
        <h1 className="text-3xl font-bold">
          Selamat Datang Di Sistem Informasi Penilaian Fakultas Kedokteran...!
        </h1>
        <h2>Silahkan Melakukan Login Untuk Memulai Melakukan Penilaian</h2>
      </div>

      <main className="absolute bottom-0 bg-white w-full md:w-2xl lg:w-3xl h-4/7 md:h-4/8 lg:h-10/15 rounded-t-4xl md:rounded-4xl  pt-8 md:p-5 md:static md:flex z-10">
        <div className="w-full md:w-1/2 flex flex-col items-center ">
          <div className="hidden md:block md:my-5 lg:my-0 ">
            <h1 className="text-lg lg:text-2xl font-bold">
              Selamat Datang Di Sistem Informasi Penilaian Fakultas
              Kedokteran...!
            </h1>
            <h2>Silahkan Melakukan Login Untuk Memulai Melakukan Penilaian</h2>
          </div>
          <div className="flex justify-center gap-2 bg-gray-200 w-fit p-1 rounded-full ">
            <button className="bg-blue-900 text-white rounded-full px-12 py-3 font-semibold">
              User
            </button>
            <button className="rounded-full px-12 py-3 font-semibold text-gray-400">
              Admin
            </button>
          </div>
          <form
            action=""
            className="w-full px-10 mt-12 md:mt-5 flex flex-col gap-5"
          >
            <div className="flex border rounded-xl border-gray-300 p-1">
              <div className="flex items-center w-16 justify-center text-blue-900">
                <UserRound size={36} />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="username" className="text-sm text-gray-400">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="p-1 ring-0 outline-none"
                />
              </div>
            </div>
            <div className="flex border rounded-xl border-gray-300 p-1">
              <div className="flex items-center justify-center w-16  text-blue-900">
                <Lock size={32} />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="password" className="text-sm text-gray-400">
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  className="p-1 ring-0 outline-none"
                />
              </div>
            </div>
            <button className="bg-blue-900 text-white rounded-full px-12 py-3 font-semibold">
              Login
            </button>
          </form>
        </div>
        <div className="w-1/2 hidden md:flex flex-col md:h-full md:items-center md:justify-center">
          <Image
            src="/img/ilustration.png"
            alt="login"
            width={500}
            height={500}
          />
        </div>
      </main>
    </div>
  );
};