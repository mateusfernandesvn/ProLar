import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConection";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineBathroom,
  MdOutlineGarage,
  MdOutlineBedroomChild,
} from "react-icons/md";

interface HouseProps {
  id: string;
  name: string;
  rooms: string;
  priceType: string;
  bathroom: string;
  address: string;
  garage: string;
  city: string;
  cep: string;
  year: string;
  description: string;
  created: string;
  price: string | number;
  uid: string;
  whatsapp: string;
  owner: string;
  images: ImagemHouseProps[];
}
interface ImagemHouseProps {
  uid: string;
  name: string;
  url: string;
}

export function HouseDetails() {
  const { id } = useParams();
  const [house, setHouse] = useState<HouseProps>();
  const [sliderPerView, setSliderPerView] = useState<number>(2);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHouse() {
      if (!id) {
        return;
      }
      const docRef = doc(db, "houses", id);
      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/");
        }
        setHouse({
          id: snapshot.id,
          name: snapshot.data()?.name,
          rooms: snapshot.data()?.rooms,
          cep: snapshot.data()?.cep,
          priceType: snapshot.data()?.priceType,
          bathroom: snapshot.data()?.bathroom,
          address: snapshot.data()?.address,
          garage: snapshot.data()?.garage,
          city: snapshot.data()?.city,
          year: snapshot.data()?.year,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          price: snapshot.data()?.price,
          uid: snapshot.data()?.uid,
          whatsapp: snapshot.data()?.whatsapp,
          images: snapshot.data()?.images,
          owner: snapshot.data()?.owner,
        });
      });
    }
    loadHouse();
  }, [id, navigate]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {house && (
        <Swiper
          slidesPerView={sliderPerView}
          pagination={{ clickable: true }}
          navigation
        >
          {house?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img src={image.url} className="w-full h-96 object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {house && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{house?.name}</h1>
            <h1 className="font-bold text-3xl text-black">R${house?.price} {house?.priceType}</h1>
          </div>
        

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <p className="font-semibold">Cidade:</p>
                <p className="capitalize">{house?.city}</p>
                </div>

                <div className="flex gap-2">
                <p className="font-semibold">Endereço</p>
                <p>{house?.address}</p>
                </div>

                <div className="flex gap-2">
                <p>CEP:</p>
                <p>{house?.cep}</p>
                </div>
              
              <div className="flex flex-col">
                <div className="text-zinc-700 mb-6 flex items-center  gap-4">
                  <span className="flex items-center  gap-1">
                    <MdOutlineBedroomChild size={20} title="quartos" />
                    {house?.rooms} quartos
                  </span>
                  <span className="flex items-center gap-1">
                    <MdOutlineBathroom size={20} title="banheiro" />
                    {house?.bathroom}{" "} banheiro
                  </span>
                  <span className="flex items-center gap-1">
                    <MdOutlineGarage size={20} title="garagem" />
                    {house?.garage}{" "} garagem
                  </span>
                </div>
             
              </div>
            </div>
          </div>

          <strong>Descrição</strong>
          <p className="mb-4 text-justify">{house?.description}</p>

          <strong>Telefone / WhatsApp</strong>
          <p className="mb-4">{house?.whatsapp}</p>

          <a
            href={`https://api.whatsapp.com/send?phone=${house?.whatsapp}&text=Olá! Gostaria de alugar esse imóvel  ${house?.name}`}
            target="_blank"
            className="bg-green-500 w-80 m-auto text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer"
          >
            Conversar com o vendedor
            <FaWhatsapp size={26} color="#fff" />
          </a>
        </main>
      )}
    </Container>
  );
}
