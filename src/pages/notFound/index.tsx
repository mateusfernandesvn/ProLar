import { Link } from "react-router-dom";
import img from "../../assets/error.svg";

export default function NotFound() {
  return (
    <div className="min-h-screen flex  items-center  bg-slate-50 justify-center ">
      <div className="max-md:hidden">
      <img src={img} alt=""  className="w-64" />
      </div>
      <div className="flex flex-col items-center m-8">

      <h2 className="font-bold text-7xl text-red-700 mb-4">404 :( </h2>
      <h3 className="font-semibold text-2xl mb-6">
        Ops !Esta Página não foi encontrada
      </h3>
      <Link
        to="/"
        className="bg-red-600 text-white font-medium py-2 px-4 rounded-md "
        >
        Voltar para o home
      </Link>
        </div>
    </div>
  );
}
