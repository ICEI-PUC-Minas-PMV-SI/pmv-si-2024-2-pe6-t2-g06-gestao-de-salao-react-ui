// Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Certifique-se de criar um arquivo CSS separado, se necessário

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
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
                            <button className="signup-button" onClick={() => navigate('/register')}>
                                Cadastre-se
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
