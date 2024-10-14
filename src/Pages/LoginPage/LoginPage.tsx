import React from "react";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../Context/useAuth';
import { useForm } from 'react-hook-form';
import Header from '../../Components/Header';
import '../LoginPage/LoginPage.css'; // Importando o CSS aqui

type Props = {};

type LoginFormsInputs = {
    email: string;
    senha: string;
};

const validation = Yup.object().shape({
    email: Yup.string().required('email is required'),
    senha: Yup.string().required('Pass is required'),
});

const LoginPage = (props: Props) => {
    const { loginUser } = useAuth();
    const { register, handleSubmit, formState: { errors }} = useForm<LoginFormsInputs>({resolver: yupResolver(validation)})
    
    const handleLogin = ( form: LoginFormsInputs) => {
        loginUser(form.email, form.senha);
    }
    return (
        <section className="login-section">
            <Header />
            <div className="login-container">
                <div className="login-card">
                    <div className="login-content">
                        <h1 className="login-title">Faça login na sua conta</h1>
                        <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    className="form-input"
                                    placeholder="Email"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="error-message">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="senha" className="form-label">Senha</label>
                                <input
                                    type="password"
                                    id="senha"
                                    placeholder="••••••••"
                                    className="form-input"
                                    {...register("senha")}
                                />
                                {errors.senha && (
                                    <p className="error-message">{errors.senha.message}</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <a href="#" className="forgot-password">
                                    Esqueceu a senha?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="button" // Usando a classe comum para o botão
                            >
                                Entrar
                            </button>
                            <p className="signup-prompt">
                                Não tem uma conta ainda?{" "}
                                <a href="#" className="signup-link button">
                                    Cadastre-se
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
