import React from 'react';
import Header from '../../Components/Header'; // Ajuste o caminho conforme necessário
import './HomePage.css';

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            <Header /> {/* Inclui o cabeçalho */}
            <main className="main-content">
                <section className="intro-section">
                    <h2>Bem-vindo ao BelezaMarket</h2>
                    <p>O marketplace perfeito para agendar seus serviços de beleza com praticidade.</p>
                </section>

                <section className="features-section">
                    <div className="feature">
                        <img src="https://via.placeholder.com/300" alt="Serviços de Beleza" />
                        <h3>Encontre Profissionais</h3>
                        <p>Agende com os melhores profissionais da sua região, de forma rápida e fácil.</p>
                    </div>

                    <div className="feature">
                        <img src="https://via.placeholder.com/300" alt="Salão de Beleza" />
                        <h3>Encontre Salões</h3>
                        <p>Descubra salões renomados próximos a você, com agendamentos simplificados.</p>
                    </div>

                    <div className="feature">
                        <img src="https://via.placeholder.com/300" alt="Agendamento Fácil" />
                        <h3>Agendamento Fácil</h3>
                        <p>Com poucos cliques, reserve seus horários no conforto do seu lar.</p>
                    </div>

                    <div className="feature">
                        <img src="https://via.placeholder.com/300" alt="Promoções Exclusivas" />
                        <h3>Promoções e Ofertas</h3>
                        <p>Receba ofertas e pacotes exclusivos diretamente no app, sempre com ótimos descontos.</p>
                    </div>
                </section>
            </main>
            <footer className="footer">
                <p>&copy; 2024 BelezaMarket - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default HomePage;
