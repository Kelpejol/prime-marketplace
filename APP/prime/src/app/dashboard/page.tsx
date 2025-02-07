import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Dashboard from "./Dashboard";
import { getAuthResult } from "../actions/login";
import { decodeJWT } from "thirdweb/utils";
export default async function page() {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("jwt")?.value;
    
    

    if (!jwt) {
      redirect("/marketplace?redirected=true");
    }

    const authResult = await getAuthResult(jwt);
       
    if (!authResult.valid) {
      redirect("/marketplace?redirected=true");
    }

    return (
      <section className="min-h-screen bg-[#212534]">
        <Dashboard />
      </section>
    );
  } catch (error) {
    console.error(error);
  redirect("/marketplace?redirected=true");
  }
}
