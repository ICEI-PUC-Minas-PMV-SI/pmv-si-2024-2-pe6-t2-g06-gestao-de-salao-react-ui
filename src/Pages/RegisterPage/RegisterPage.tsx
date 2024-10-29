// import React from "react";
// import * as Yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useAuth } from "../Context/useAuth";
// import { useForm } from "react-hook-form";

// type LoginFormInputs = {
//   email: string;
//   senha: string;
// };

// const validationSchema = Yup.object().shape({
//   email: Yup.string().required("Email is required"),
//   senha: Yup.string().required("Password is required"),
// });

// const LoginPage = () => {
//   const { loginUser } = useAuth();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormInputs>({ resolver: yupResolver(validationSchema) });

//   const handleLogin = (form: LoginFormInputs) => {
//     loginUser(form.email, form.senha);
//   };

//   return (
//     <section className="bg-gray-50 dark:bg-gray-900">
//       <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//         <div className="w-full bg-white rounded-lg shadow dark:border md:mb-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//           <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//             <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//               Sign in to your account
//             </h1>
//             <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleLogin)}>
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="text"
//                   id="email"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   placeholder="Email"
//                   {...register("email")}
//                 />
//                 {errors.email && (
//                   <p className="text-white">{errors.email.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="senha"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                 >
//                   Password
//                 </label>
//                 <input
//                   type="senha"
//                   id="senha"
//                   placeholder="••••••••"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   {...register("senha")}
//                 />
//                 {errors.senha && (
//                   <p className="text-white">{errors.senha.message}</p>
//                 )}
//               </div>
//               <div className="flex items-center justify-between">
//                 <a
//                   href="#"
//                   className="text-sm text-white font-medium text-primary-600 hover:underline dark:text-primary-500"
//                 >
//                   Forgot senha?
//                 </a>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full text-white bg-lightGreen hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//               >
//                 Sign in
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LoginPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import { registerUser } from '../api/UsuarioAPI';


interface Usuario {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  dataNascimento: string;
  genero: number;
  perfil: number;
}

const generoOptions = [
  { label: 'Masculino', value: 0 },
  { label: 'Feminino', value: 1 },
  { label: 'Outro', value: 2 },
];

const perfilOptions = [
  { label: 'Administrador', value: 0 },
  { label: 'Profissional', value: 1 },
  { label: 'Usuario', value: 2 },
];

const CadastroUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    dataNascimento: '',
    genero: generoOptions[0].value,
    perfil: perfilOptions[0].value,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await registerUser(usuario); // Pass usuario data to registerUser
      setIsLoading(false);
      navigate(`/login`);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Cadastro falhou. Por favor, tente novamente.');
    }
  };

  return (
    <div className='all'>
      <div className="login-section">
        <div className="navbar">
          <div className="container">
            <div className="logo" >Cadastro</div>
          </div>
        </div>
        <div className="cadastro-section">
          <div className="cadastro-card">
            <div className="cadastro-content">
              <form className="cadastro-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome:</label>
                    <input
                      type="text"
                      name="nome"
                      className="form-input"
                      value={usuario.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={usuario.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Senha:</label>
                    <input
                      type="password"
                      name="senha"
                      className="form-input"
                      value={usuario.senha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone:</label>
                    <input
                      type="tel"
                      name="telefone"
                      className="form-input"
                      value={usuario.telefone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Endereço:</label>
                    <input
                      type="text"
                      name="endereco"
                      className="form-input"
                      value={usuario.endereco}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cidade:</label>
                    <input
                      type="text"
                      name="cidade"
                      className="form-input"
                      value={usuario.cidade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Estado:</label>
                    <input
                      type="text"
                      name="estado"
                      className="form-input"
                      value={usuario.estado}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CEP:</label>
                    <input
                      type="text"
                      name="cep"
                      className="form-input"
                      value={usuario.cep}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Data de Nascimento:</label>
                    <input
                      type="date"
                      name="dataNascimento"
                      className="form-input"
                      value={usuario.dataNascimento}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gênero:</label>
                    <select
                      name="genero"
                      className="form-input"
                      value={usuario.genero}
                      onChange={handleChange}
                      required
                    >
                      {generoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Perfil:</label>
                    <select
                      name="perfil"
                      className="form-input"
                      value={usuario.perfil}
                      onChange={handleChange}
                      required
                    >
                      {perfilOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="button">Cadastrar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CadastroUsuario;

function setErrorMessage(arg0: null) {
  throw new Error('Function not implemented.');
}
function setIsLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

