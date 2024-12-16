import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConection";

export function DashboardHeader () {
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="w-full items-center flex h-12 bg-blue-600 rounded-lg text-white font-medium gap-4 px-4 mb-4 max-sm:text-sm ">
      <Link to="/dashboard">Meus Imóveis</Link>
      <Link to="/dashboard/new">Cadastrar </Link>
      <button className="ml-auto border-2  bg-transparent border-blue-50 px-2 rounded-md" onClick={handleLogout}>Sair da conta</button>
    </div>
  );
}
