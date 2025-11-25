import React,{ useState, FormEvent } from "react";
import { UserRound, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";


export default function Login() {
   const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/admin/dashboard");
    } catch (error) {
      setError("Terjadi kesalahan");
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-300 h-screen w-screen relative  md:flex md:items-center md:justify-center">
      <div className="text-white p-5 md:hidden">
        <h1 className="text-3xl font-bold">
          Selamat Datang Di Sistem Informasi Penilaian Fakultas Kedokteran...!
        </h1>
        <h2>Silahkan Melakukan Login Untuk Memulai Melakukan Penilaian</h2>
      </div>

      <main className="absolute bottom-0 bg-white w-full md:w-2xl lg:w-3xl h-4/7 md:h-4/8 lg:h-10/15 rounded-t-4xl md:rounded-2xl  pt-8 md:p-5 md:static md:flex z-10">
        <div className="w-full md:w-1/2 flex flex-col items-center ">
          <div className="hidden md:block md:my-5 lg:my-0 px-10 pt-10 ">
            <h1 className="text-lg lg:text-2xl font-bold">
              Hello, <br /> Wellcome Back
            </h1>
            <h2>Silahkan Melakukan Login Untuk Memulai Melakukan Penilaian</h2>
          </div>
           {error && (
          <div className="my-2 px-3 py-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
          <form
          onSubmit={handleSubmit}
            action=""
            className={`w-full px-10 mt-12  flex flex-col gap-5 ${error ? "md:mt-2" : "md:mt-5"}`}
          >
            <div className="flex border rounded-md border-gray-300 p-1">
              <div className="flex items-center w-9 justify-center text-gray-400">
                <UserRound size={20} />
              </div>
              <div className="flex flex-col w-full">
                <input
                  type="email"
                  name="email"
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="contoh@universitasbumigora.ac.id"
                  className="p-1 ring-0 outline-none"
                />
              </div>
            </div>
            <div className="flex border rounded-md border-gray-300 p-1">
              <div className="flex items-center justify-center w-9  text-gray-400">
                <Lock size={20} />
              </div>
              <div className="flex flex-col w-full">
  
                <input

                  type="password"
                  name="password"
                  placeholder="password"
                  onChange={(e)=>setPassword(e.target.value)}
                  className="p-1 ring-0 outline-none"
                />
              </div>
            </div>
            <button disabled={loading} type="submit" className="bg-blue-900 text-white rounded-md px-12 py-2 font-semibold">
              {loading ? "Loading..." : "Login"}
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

// Redirect jika sudah login
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};