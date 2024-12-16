import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

import { FiLogIn } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";


export function Header() {
  const { signed, loadingAuth } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-20 bg-white drop-shadow mb-4">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
        <Link to="/">
          <h1 className="font-bold text-3xl text-blue-700 bg-blue-100 rounded-lg p-2">
            Pro<span className="text-blue-500">Lar</span>
          </h1>
        </Link>

        {!loadingAuth && signed && (
          <div className="flex gap-6 border-l-2 border-gray-300 pl-5">
            <Link to="/">
              <FaRegHeart size={26} color="#000" />
            </Link>

            <Link to="/dashboard">
              <FaRegUserCircle size={26} color="#000" />
            </Link>
          </div>
        )}

        {!loadingAuth && !signed && (
          <div className="flex gap-4 items-center">
            <Link to="/register" className="border-2 bg-blue-600 font-bold text-white border-none rounded-lg p-3 max-md:hidden ">Criar conta</Link>
            <Link
              to="/login"
              className="flex items-center gap-2 p-3 hover:scale-110 transition-all text-blue-700"
            >
              <FiLogIn size={24} color="#1d4ed8" />
              <p className="font-medium">Entrar</p>
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}
