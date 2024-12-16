import { ChangeEvent, useState, useContext } from "react";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";
import { FiTrash, FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { storage, db } from "../../../services/firebaseConection";
import toast from "react-hot-toast";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

const schema = z.object({
  name: z.string().min(2, "O campo título é obrigatório"),
  metros: z.string().min(1, "m² obrigatório"),
  rooms: z.string().min(1, "A quantidade de quartos é obrigatória"),
  bathroom: z.string().min(1, "A quantidade de banheiros é obrigatória"),
  garage: z.string().min(1, "A quantidade de garagens é obrigatória"),
  price: z.string().min(2, "O preço é obrigatório"),
  priceType: z.string().min(1, "O tipo de valor é obrigatório"),
  city: z.string().min(2, "A cidade é obrigatória"),
  address: z.string().min(2, "O Endereço é obrigatório"),
  cep: z
    .string()
    .length(8, "O CEP deve ter 8 dígitos")
    .regex(/^\d{8}$/, "O CEP deve conter apenas números"),
  whatsapp: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Número de telefone inválido.",
    }),
  description: z.string().min(2, "A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ImagemItemProps {
  uid: string;
  name: string;
  url: string;
  previewUrl: string;
}

export function New() {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [houseImages, setHouseImages] = useState<ImagemItemProps[]>([]);

  function onSubmit(data: FormData) {
    if (houseImages.length === 0) {
      toast.error("Envie pelo menos uma imagem");
      return;
    }

    const HouseListImages = houseImages.map((house) => ({
      uid: house.uid,
      name: house.name,
      url: house.url,
    }));

    addDoc(collection(db, "houses"), {
      name: data.name.toUpperCase(),
      rooms: data.rooms,
      bathroom: data.bathroom,
      metros: data.metros,
      garage: data.garage,
      price: data.price,
      priceType: data.priceType,
      city: data.city,
      address: data.address,
      cep: data.cep,
      whatsapp: data.whatsapp,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: HouseListImages,
      description: data.description,
    })
      .then(() => {
        reset();
        setHouseImages([]);
        toast.success("Imóvel cadastrado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao cadastrar imóvel:", error);
        toast.error("Erro ao cadastrar imóvel");
      });
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((image) => {
        if (image.type === "image/jpeg" || image.type === "image/png") {
          handleUpload(image);
        } else {
          toast.error("Imagem inválida. Aceitamos apenas JPEG e PNG.");
        }
      });
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      toast.error("Usuário não autenticado.");
      return;
    }

    const currentUid = user.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imagemItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };
        setHouseImages((prevImages) => [...prevImages, imagemItem]);
        toast.success("Imagem enviada com sucesso!");
      });
    });
  }

  async function handleDeleteImage(item: ImagemItemProps) {
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setHouseImages((prevImages) =>
        prevImages.filter((house) => house.url !== item.url)
      );
      toast.success("Imagem excluída com sucesso!");
    } catch (error) {
      console.log("Erro ao excluir imagem:", error);
      toast.error("Erro ao excluir imagem.");
    }
  }

  return (
    <Container>
      <DashboardHeader />
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              className="opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>
        </button>
        {houseImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              className="absolute"
              onClick={() => handleDeleteImage(item)}
            >
              <FiTrash size={28} color="#fff" />
            </button>
            <img
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover"
              alt="foto do imóvel"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row gap-2 mt-2">
        <form action="" className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="name" className="mb-2 font-medium">
              Título
            </label>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Casa de aluguel..."
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4 max-sm:flex-col">
            <div className="w-full">
              <label htmlFor="rooms" className="mb-2 font-medium">
                Quartos
              </label>
              <Input
                type="number"
                register={register}
                name="rooms"
                error={errors.rooms?.message}
                placeholder="Ex: 2"
              />
            </div>
            <div className="w-full">
              <label htmlFor="bathroom" className="mb-2 font-medium">
                Banheiro
              </label>
              <Input
                type="number"
                register={register}
                name="bathroom"
                error={errors.bathroom?.message}
                placeholder="Ex: 1"
              />
            </div>
            <div className="w-full">
              <label htmlFor="garage" className="mb-2 font-medium">
                Garagem
              </label>
              <Input
                type="number"
                register={register}
                name="garage"
                error={errors.garage?.message}
                placeholder="Ex: 2"
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4 max-sm:flex-col ">
            <div className="w-full">
              <label htmlFor="metros" className="mb-2 font-medium">
                Metros quadrados m²
              </label>
              <Input
                type="text"
                register={register}
                name="metros"
                error={errors.metros?.message}
                placeholder="Ex: 120 m²"
              />
            </div>

            <div className="w-full">
              <label htmlFor="price" className="mb-2 font-medium">
                Preço
              </label>
              <Input
                type="text"
                register={register}
                name="price"
                error={errors.price?.message}
                placeholder="Ex: R$ 1200"
              />
            </div>
            <div className="w-full">
              <label htmlFor="priceType" className="mb-2 font-medium">
                Tipo de valor
              </label>
              <select
                className="p-2 w-full  rounded border-2 border-gray-300"
                {...register("priceType")}
              >
                <option value="diária">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="finalDeSemana">Final de Semana</option>
                <option value="mensal">Mensal</option>
              </select>
              {errors.priceType && (
                <p className="text-sm text-red-600">
                  {errors.priceType.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4 max-sm:flex-col">
            <div className="w-full">
              <label htmlFor="whatsapp" className="mb-2 font-medium">
                Telefone
              </label>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 71996783434"
              />
            </div>

            <div className="w-full">
              <label htmlFor="city" className="mb-2 font-medium">
                Cidade
              </label>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Salvador"
              />
            </div>
            <div className="w-full">
              <label htmlFor="cep" className="mb-2 font-medium">
                CEP
              </label>
              <Input
                type="text"
                register={register}
                name="cep"
                error={errors.cep?.message}
                placeholder="Ex: 41481-184"
                maxLength={8}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="w-full">
              <label htmlFor="address" className="mb-2 font-medium">
                Endereço
              </label>
              <Input
                type="text"
                register={register}
                name="address"
                error={errors.address?.message}
                placeholder="Ex: Rio Vermelho, Rua..."
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="mb-2 font-medium">
              Descrição
            </label>
            <textarea
              rows={4}
              className={`p-2 border-2 w-full  rounded ${
                errors.description ? "border-red-600 border-2" : "border-gray-300"
              }`}
              placeholder="Ex: Excelente imóvel..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-1/2 flex m-auto justify-center bg-blue-600 text-white p-3 rounded-lg mt-2 hover:bg-blue-500 transition-all duration-200"
          >
            Cadastrar Imóvel
          </button>
        </form>
      </div>
    </Container>
  );
}
