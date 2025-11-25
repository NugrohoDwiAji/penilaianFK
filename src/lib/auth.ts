import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  return session;
}

export async function requireRole(role: string) {
  const session = await requireAuth();
  
  if (session.user.role !== role) {
    redirect("/unauthorized");
  }
  
  return session;
}