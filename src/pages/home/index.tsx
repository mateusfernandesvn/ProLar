import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Container } from "../../components/container";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebaseConection";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css/pagination";

import banner from "../../assets/banner.png";
import banner2 from "../../assets/banner2.png";

import { LuMapPin } from "react-icons/lu";
import {
  MdOutlineBathroom,
  MdOutlineGarage,
  MdOutlineBedroomChild,
} from "react-icons/md";


interface HouseProps {
  id: string;
  name: string;
  rooms: string;
  bathroom: string;
  garage: string;
  priceType: string;
  price: string | number;
  city: string;
  uid: string;
  images: HouseImagesProps[];
}

interface HouseImagesProps {
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const [houses, setHouses] = useState<HouseProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadHouses();
  }, []);

  function loadHouses() {
    const housesRef = collection(db, "houses");
    const queryRef = query(housesRef, orderBy("created", "desc"));
    getDocs(queryRef).then((snapshot) => {
      const listHouses = [] as HouseProps[];
      snapshot.forEach((doc) => {
        listHouses.push({
          id: doc.id,
          name: doc.data().name,
          rooms: doc.data().rooms,
          bathroom: doc.data().bathroom,
          priceType: doc.data().priceType,
          garage: doc.data().garage,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images,
          uid: doc.data().uid,
        });
      });
      setHouses(listHouses);
    });
  }

  async function handleSearchHouses() {
    if (input === "") {
      loadHouses();
      return;
    }
    setHouses([]);
    setLoadImages([]);

    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    const listHouses = [] as HouseProps[];
    querySnapshot.forEach((doc) => {
      listHouses.push({
        id: doc.id,
        name: doc.data().name,
        rooms: doc.data().rooms,
        bathroom: doc.data().bathroom,
        priceType: doc.data().priceType,
        garage: doc.data().garage,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid,
      });
    });
    setHouses(listHouses);
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  return (
    <Container>
      
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src={banner}
            className="w-full h-96  object-cover max-lg:h-auto"
            alt="Banner 1"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={banner2}
            className="w-full h-96 object-cover max-lg:h-auto"
            alt="Banner 2"
          />
        </SwiperSlide>
      </Swiper>

      <section className=" bg-white p-4 rounded-b-lg w-full  mx-auto flex justify-center items-center gap-2 ">
        <input
          type="text"
          placeholder="Digite o endereço do imovel"
          className="w-1/2 border-2 rounded-lg h-12 p-4 outline-none max-sm:w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-600 h-12 px-6 rounded-lg text-white font-medium text-lg hover:bg-blue-500 transition-all duration-300"
          onClick={handleSearchHouses}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-medium  uppercase text-center text-4xl tracking-wide m-8 max-md:text-2xl">
        Alugue sua casa rápido e fácil!
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
        {houses.map((house) => (
          <Link key={house.id} to={`/house/${house.id}`}>
            <section className="w-full  bg-white rounded-lg relative group overflow-hidden">
              <div
                className="w-full h-72 rounded-lg bg-slate-200 "
                style={{
                  display: loadImages.includes(house.id) ? "none" : "block",
                }}
              ></div>
              <div className="max-h-72 bg-white rounded-lg relative group overflow-hidden">
                <img
                  className="w-full mb-4 max-h-72 group-hover:scale-110 transition-all duration-300"
                  src={house.images[0].url}
                  alt={house.name}
                  onLoad={() => handleImageLoad(house.id)}
                  style={{
                    display: loadImages.includes(house.id) ? "block" : "none",
                  }}
                />
              </div>
              <p className=" mt-1 mb-2 px-2">{house.name}</p>

              <div className="flex flex-col px-2">
                <div className="text-zinc-700 mb-6 flex items-center  gap-4">
                  <span className="flex items-center gap-1">
                    <MdOutlineBedroomChild size={24} />
                    {house.rooms}{" "}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdOutlineBathroom size={24} />
                    {house.bathroom}{" "}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdOutlineGarage size={24} />
                    {house.garage}{" "}
                  </span>
                </div>
                <p className="font-medium capitalize text-gray-900 text-xl">
                  R$ {house.price} {house.priceType}
                </p>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-zinc-700 flex gap-1 capitalize">
                  <LuMapPin size={20} />
                  {house.city}
                </span>
              </div>
            </section>
          </Link>
        ))}
      </main>

      <div>

        <section className="w-full  justify-center my-20 flex flex-col ">
          <h2 className="text-3xl font-medium mb-6 max-md:text-2xl">
            ProLar - Tipos de aluguel
          </h2>

          <div className="flex text-lg gap-4 max-sm:flex-col text-center max-sm:max-w-40  ">
            <div className="flex-full capitalize bg-blue-500 hover:scale-105 transition-all duration-300  text-white p-4 rounded-lg max-md:p-2">
              <p> Mensal</p>
            </div>
            <div className="flex-full  gap-4 bg-blue-500 hover:scale-105 transition-all duration-300 text-white p-4 rounded-lg max-md:p-2">
              <p>Semanal</p>
            </div>

            <div className="flex-full gap-4  bg-blue-500 hover:scale-105 transition-all duration-300 text-white p-4 rounded-lg max-md:p-2">
              <p> temporada</p>
            </div>
            <div className="flex-full gap-4  bg-blue-500 hover:scale-105 transition-all duration-300 text-white p-4 rounded-lg max-md:p-2 ">
              <p> Fim de Semana</p>
            </div>
          </div>
        </section>

        <section className="w-full  justify-center my-20 flex flex-col ">
          <h2 className="text-3xl font-medium max-md:text-2xl ">
            Encontre seu próximo lar em uma destas cidades
          </h2>
          <div className="grid grid-cols-4 gap-6 my-8 mx-6 font-semibold text-xl text-blue-800  max-md:grid-cols-2">
            <ul className="list-disc  capitalize">
              <li>São Paulo</li>
              
            </ul>
            <ul className="list-disc capitalize">
              <li>Rio de Janeiro</li>
            </ul>
            <ul className="list-disc capitalize">
              <li>Salvador</li>
            </ul>
            <ul className="list-outside list-disc capitalize">
              <li>Porto Alegre</li>
            </ul>
            <ul className="list-disc capitalize">
              <li>Fortaleza</li>
            </ul>
            <ul className=" list-disc capitalize">
              <li>Curitiba</li>
            </ul>

            <ul className="list-disc capitalize">
              <li>Belo Horizonte</li>
            </ul>
            <ul className="list-disc capitalize">
              <li>Recife</li>
            </ul>
          </div>
        </section>

        <div className=" h-60 flex justify-center items-center bg-blue-700 shadow-lg shadow-cyan-500/50  rounded-lg max-md:h-52  ">
          <h1 className="text-6xl text-white font-bold max-w-4xl text-center select-none animate-pulse max-md:text-4xl">
            Anuncie os seus imóveis conoscos!
          </h1>
        </div>

      </div>
    </Container>
  );
}
