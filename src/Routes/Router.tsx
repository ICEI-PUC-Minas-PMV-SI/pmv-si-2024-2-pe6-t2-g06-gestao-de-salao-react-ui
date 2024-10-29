// router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import AgendamentoPage from "../Pages/Agendamentos/AgendamentoPage";
// Change to default import if LoginPage is the default export
import LoginPage from "../Pages/LoginPage/LoginPage"; 
import React from 'react';
import { UserProvider } from '../Pages/Context/UserProvider'; // Import UserProvider
import CadastroUsuario from "../Pages/LoginPage/CadastroUsuario";

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
      { path: "cadastro", element: <CadastroUsuario /> },
      { path: "agendamento/:userId", element: <AgendamentoPage /> }, // Use :userId to capture the dynamic parameter
    ],
  },
]);
