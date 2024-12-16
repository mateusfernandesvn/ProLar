import { useEffect, useState, useContext } from "react";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelheader";
import { FiTrash2 } from "react-icons/fi";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../services/firebaseConection";
import { ref, deleteObject } from "firebase/storage";
import { AuthContext } from "../../contexts/AuthContext";

interface houseProps {
  id: string;
  name: string;
  year: string;
  price: string | number;
  km: string;
  city: string;
  images: ImagemhouseProps[];
  uid: string;
}

interface ImagemhouseProps {
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
  const [houses, sethouses] = useState<houseProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadhouses() {
      if (!user?.uid) {
        return;
      }

      const housesRef = collection(db, "houses");
      const queryRef = query(housesRef, where("uid", "==", user.uid));
      getDocs(queryRef).then((snapshot) => {
        const listhouses = [] as houseProps[];
        snapshot.forEach((doc) => {
          listhouses.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid,
          });
        });
        sethouses(listhouses);
      });
    }
    loadhouses();
  }, [user]);

  async function handleDeletehouse(house: houseProps) {
    const itemhouse = house;
    const docRef = doc(db, "houses", itemhouse.id);
    await deleteDoc(docRef);
    itemhouse.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;

      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
        console.log("Imagem excluída com sucesso");
        sethouses(houses.filter((house) => house.id !== itemhouse.id));
      } catch (err) {
        console.log("Erro ao excluir essa imagem", err);
      }
    });
  }

  return (
    <Container>
      <DashboardHeader />
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {houses.length === 0 ? (
          <div className="col-span-full text-center">
            <p className="text-xl mt-6 font-bold">Ainda não há casas cadastradas.</p>
            <p className="text-gray-500">Adicione suas casas para começar.</p>
          </div>
        ) : (
          houses.map((house) => (
            <section key={house.id} className="w-full bg-white rounded-lg relative">
              <button
                onClick={() => handleDeletehouse(house)}
                className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow hover:bg-red-500 transition-colors"
              >
                <FiTrash2 size={26} color="#000" />
              </button>
              <img
                className="w-full rounded-lg mb-2 max-h-70"
                src={house.images[0].url}
                alt={house.name}
              />
              <p className="font-bold mt-1 px-2 mb-2 "></p>
              <div className="flex flex-col px-2">
                <p>{house.name}</p>
                <p>R${house.price}</p>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>
              <div className="px-2 pb-2">
                <span className="text-black capitalize">{house.city}</span>
              </div>
            </section>
          ))
        )}
      </main>
    </Container>
  );
}
