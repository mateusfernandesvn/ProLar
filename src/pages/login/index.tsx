import { useEffect } from "react";
import { Container } from "../../components/container";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConection";
import toast from "react-hot-toast";

const schema = z.object({
  email: z
    .string()
    .email("Digite um email válido")
    .min(1, "Email é obrigatorio"),
  password: z.string().min(6, "Senha deve ter no minimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }
    handleLogout();
  }, []);

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        console.log("LOGADO COM SUCESSO");
        console.log(user);
        toast.success("Logado com sucesso!");
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        console.log("ERRO AO LOGAR");
        console.log(err);
        toast.error("Erro ao fazer o login");
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/">
          <h1 className="font-bold text-7xl text-blue-700 bg-blue-100 rounded-lg p-4">
            Pro<span className="text-blue-500">Lar</span>
          </h1>
        </Link>

        <form
          action=""
          className="max-w-lg w-full rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-800 w-full text-white rounded-md h-10 font-medium"
          >
            Acessar
          </button>
        </form>

        <Link to="/register">Ainda não possui uma conta? Cadastra-se</Link>
      </div>
    </Container>
  );
}
