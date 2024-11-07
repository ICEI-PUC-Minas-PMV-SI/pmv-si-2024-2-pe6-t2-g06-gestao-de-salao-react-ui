import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import RegisterTipoCadastro from '../Pages/RegisterPage/RegisterTipoCadastro';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRegister = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <header className="navbar">
                <div className="container">
                    <h1 className="logo" onClick={() => navigate('/')}>
                        BelezaMarket
                    </h1>
                    <nav>
                        <ul>
                            <li>
                                <button className="login-button" onClick={() => navigate('/login')}>
                                    Login
                                </button>
                            </li>
                            <li>
                                <button className="signup-button" onClick={handleRegister}>
                                    Cadastre-se
                                </button>                                                        
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Modal para cadastro fora do <header> */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>X</button>
                        <RegisterTipoCadastro onClose={closeModal} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
