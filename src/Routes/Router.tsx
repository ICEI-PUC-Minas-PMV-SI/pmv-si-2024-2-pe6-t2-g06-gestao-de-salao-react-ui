// router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import HomePage from "../Pages/HomePage/HomePage";
import RegisterTipoCadastroPage from "../Pages/RegisterPage/RegisterTipoCadastro";
import RegisterUsuarioPage from "../Pages/RegisterPage/RegisterUsuarioPage";
import RegisterProfissionalPage from "../Pages/RegisterPage/RegisterProfissionalPage";
import AgendamentoPage from "../Pages/Agendamentos/AgendamentoPage";
import LoginPage from "../Pages/LoginPage/LoginPage"; 
import React from 'react';
import { UserProvider } from '../Pages/Context/UserProvider'; // Import UserProvider

import PaymentForm from "../Pages/Pagamento/PaymentForm";
import SalonList from "../Pages/Gestao/SalonList";
import SalonForm from "../Pages/Gestao/SalonForm";
import PaymentManagement from "../Pages/Pagamento/PaymentManagement";

// Create the router
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider> {/* Wrap the App with UserProvider */}
        <App />
      </UserProvider>
    ),
    children: [
      { path: "", element: <HomePage /> },
      { path: "login", element: <LoginPage /> }, // Ensure LoginPage is defined
      { path: "register-tipo-cadastro", element: <RegisterTipoCadastroPage onClose={function (): void {
        throw new Error("Function not implemented.");
      } }/> }, // cadastro usuario
      { path: "register-usuario", element: <RegisterUsuarioPage /> }, // cadastro usuario
      { path: "register-profissional", element: <RegisterProfissionalPage /> }, // cadastro usuario
      { path: "agendamento/:userId", element: <AgendamentoPage /> }, // Use :userId to capture the dynamic parameter
      { path: "/payments", element: <PaymentManagement /> },
      { path: "/payment-form/:id?", element: <PaymentForm match={undefined} /> },
      { path: "/salons", element: <SalonList /> },
      { path: "/salon-form/:id?", element: <SalonForm /> }, 
    ],
  },
]);