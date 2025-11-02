import MainLayouts from "@/components/templates/MainLayouts";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const titles : Record<string, string> = {
    "/admin/dashboard" : "Dashboard",
    "/admin/setUp" : "Set Up",
    "/admin/kurikulum" : "Kurikulum"
  }

  const hiddenSideBard = false;

  const title = titles[router.pathname] || "SIPFK";
  return (
    <MainLayouts title={title} hiddenSideBar={hiddenSideBard}>
      <Component {...pageProps} />
    </MainLayouts>
  );
}
