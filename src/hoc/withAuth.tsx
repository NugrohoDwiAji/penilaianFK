// hoc/requireAuth.ts
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export function requireAuth<P extends { [key: string]: unknown }>(
  gssp: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    // Jika tidak ada session, redirect
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Jika ada session → jalankan GSSP asli
    return gssp(ctx);
  };
}
