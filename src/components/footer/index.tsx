import { FaInstagram, FaFacebook } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-around max-md:flex-col max-md:items-center">
          <div className="text-center my-4">
            <h3 className="text-xl font-semibold mb-4">ProLar</h3>
            <p className="text-sm max-w-sm">
              Oferecemos as melhores opções de aluguel de casas. Encontre seu
              novo lar com facilidade.
            </p>
          </div>

          <div className="text-center my-4">
            <h3 className="text-xl font-semibold mb-4">Contato</h3>
            <p className="text-sm">Email: ProLar@gmail.com</p>
            <p className="text-sm">Telefone: (11) 98765-4321</p>
          </div>

          <div className="flex flex-col text-center my-4 ">
            <h3 className="text-xl font-semibold mb-4">Redes sociais</h3>
            <div className="flex gap-3 justify-center">
              <FaInstagram size={24} />
              <FaFacebook size={24} />
              <RiTwitterXFill size={24} />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
          <p>&copy; 2024 ProLar. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}