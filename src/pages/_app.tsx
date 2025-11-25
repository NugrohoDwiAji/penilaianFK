import MainLayouts from "@/components/templates/MainLayouts";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const titles: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/setUp": "Set Up",
    "/admin/kurikulum": "Kurikulum",
  };

  const hiddenSideBar = router.pathname === "/login";

  const title = titles[router.pathname] || "SIPFK";
  return (
    <SessionProvider session={session}>
      <MainLayouts title={title} hiddenSideBar={hiddenSideBar} >
        <Component {...pageProps} />
      </MainLayouts>
    </SessionProvider>
  );
}
