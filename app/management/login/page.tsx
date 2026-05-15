import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Login from "@/app/components/Login";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    // 1. Extract the type from the session user
    const userType = session.user?.type;

    // 2. Conditional Redirect based on role
    if (userType === "admin") {
      redirect("/admin/me");
    }

    if (userType === "store") {
      redirect("/store/me");
    }

    // Default fallback if type is something else or missing
    redirect("/");
  }

  return <Login />;
}
