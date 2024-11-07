import React from 'react';
import './RegisterTipoCadastro.css';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate


interface RegisterTipoCadastroProps {
    onClose: () => void; // Callback para fechar a modal
}

const RegisterTipoCadastro: React.FC<RegisterTipoCadastroProps> = ({ onClose }) => {
    const navigate = useNavigate(); // Inicializar o useNavigate

    const handleUserRegister = () => {
        navigate('/register-usuario'); // Navegar para a RegisterPage
        onClose(); // Fecha a modal após a seleção
    };

    const handleSalonRegister = () => {
      navigate('/register-profissional'); // Navegar para a RegisterPage
      onClose(); // Fecha a modal após a seleção
    };

    return (
        <div>
            <h2>Escolha o tipo de cadastro</h2>
            <div className="modal-buttons">
                <button className="user-button" onClick={handleUserRegister}>
                    Usuário
                </button>
                <button className="salon-button" onClick={handleSalonRegister}>
                    Profissional
                </button>
            </div>
        </div>
    );
};

export default RegisterTipoCadastro;
