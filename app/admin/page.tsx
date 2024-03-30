import {isAdmin} from "@/lib/admin";
import dynamic from "next/dynamic";
import {redirect} from "next/navigation";

const App = dynamic(() => import("./app"), {ssr: false});

type Props = {};

async function AdminPage({}: Props) {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/");
  }
  return (
    <div>
      <App />
    </div>
  );
}

export default AdminPage;
