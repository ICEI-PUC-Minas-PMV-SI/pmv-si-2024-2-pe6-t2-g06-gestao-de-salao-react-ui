import React, { useState } from 'react';
import { useAuth } from '../Context/UserProvider'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './LoginPage.css'; // Import the CSS file

const LoginPage: React.FC = () => {
    const { loginUser } = useAuth(); // Use the loginUser function from context
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Optional: for error messages
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const goToRegisterUser = () =>{
        navigate(`/register`)
        

    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null); // Reset the error message before submitting
        setIsLoading(true); // Set loading to true when submitting

        try {
            const userId = await loginUser(email, senha); // Call the loginUser function and get userId
            setIsLoading(false); // Set loading to false after the login is done
            navigate(`/agendamento/${userId}`); // Navigate to agendamentos with userId as a parameter
        } catch (error) {
            setIsLoading(false); // Stop the loading indicator
            setErrorMessage("Login failed. Please check your credentials."); // Set error message
        }
    };

    return (
        <div className="login-section">
            {/* Header Section */}
            <div className="navbar">
                <div className="container">
                    <div className="logo">Beleza Market</div>
                    <nav>
                        <ul>
                            <li><button className="login-button">Login</button></li>
                            <li><button className="signup-button" onClick={() => navigate('/cadastro')}>Cadastre-se</button></li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-content">
                        <h1 className="login-title">Login</h1>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email:</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading} // Disable the input when loading
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Senha:</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                    disabled={isLoading} // Disable the input when loading
                                />
                            </div>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button type="submit" className="button" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Entrar"} {/* Show loading state */}
                            </button>
                            <p className="forgot-password">Esqueceu a senha?</p>
                        </form>
                        <p className="signup-prompt">
                            Não tem uma conta? <span className="signup-link" onClick={() => navigate('/cadastro')}>Cadastre-se</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; // Export LoginPage as default
