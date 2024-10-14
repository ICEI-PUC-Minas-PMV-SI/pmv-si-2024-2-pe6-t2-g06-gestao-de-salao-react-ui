import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/useAuth';
import { getAgendamentosAPI } from '../api/AgendamentoAPI';
import Header from '../../Components/Header'; // Ajuste o caminho conforme necessário
import { FaEye, FaTimes } from 'react-icons/fa'; // Importando os ícones de "olho" para visualizar e "X" para cancelar
import '../Agendamentos/AgendamentoPage.css';

const AgendamentosPage: React.FC = () => {
    const { token, user } = useAuth(); // Obter token e informações do usuário a partir do contexto
    const userId = user?.userId; // Acessar userId de forma segura usando optional chaining
    const [agendamentos, setAgendamentos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            const localStorageToken = localStorage.getItem("token");
            const storedUserId = Number(localStorage.getItem("userId"));

            // Se não houver token ou userId, não buscar
            if (!localStorageToken || !storedUserId) {
                setError('Token ou ID de usuário ausente.');
                setLoading(false);
                return;
            }

            try {
                const data = await getAgendamentosAPI(localStorageToken, storedUserId);
                setAgendamentos(data);
                console.log("Agendamentos buscados:", data); // Log de dados buscados para depuração
            } catch (error) {
                setError('Erro ao buscar os agendamentos');
                console.error("Erro ao buscar agendamentos:", error); // Log de detalhes do erro para depuração
            } finally {
                setLoading(false); // Sempre definir o carregamento como falso após a busca
            }
        };

        fetchAgendamentos();
    }, [token, userId]); // Buscar quando token ou userId mudar

    // Função para lidar com a ação de cancelar agendamento
    const handleCancel = (id: number) => {
        console.log(`Cancelando agendamento com id: ${id}`);
        // Chamar a API de cancelamento aqui
    };

    // Função para visualizar detalhes do agendamento
    const handleViewDetails = (id: number) => {
        console.log(`Visualizando detalhes do agendamento com id: ${id}`);
        // Navegar para página de detalhes ou mostrar modal
    };

    // Função para verificar se o agendamento está no passado
    const isPastAgendamento = (dataAgendamento: string) => {
        const today = new Date();
        const agendamentoDate = new Date(dataAgendamento);
        return agendamentoDate < today;
    };

    // Função para verificar se o agendamento está cancelado
    const isCanceledAgendamento = (status: string) => {
        return status === 'Cancelado';
    };

    // Formatar a data para dd/mm/yyyy
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    // Renderizar estado de carregamento ou mensagem de erro
    if (loading) {
        return <p>Carregando seus agendamentos...</p>;
    }

    // Filtrar agendamentos ativos e inativos
    const sortedAgendamentos = agendamentos.sort((b, a) => {
        const dateA = new Date(a.dataAgendamento).getTime();
        const dateB = new Date(b.dataAgendamento).getTime();

        const isConfirmedA = a.status === 'confirmado';
        const isConfirmedB = b.status === 'confirmado';

        // Ordenar por status confirmado primeiro
        if (isConfirmedA && !isConfirmedB) return -1; // A vem primeiro
        if (!isConfirmedA && isConfirmedB) return 1; // B vem primeiro

        // Se ambos ou nenhum são confirmados, ordenar por data
        return dateA - dateB; // Data mais próxima vem primeiro
    });

    // Obtendo a data atual formatada
    const todayFormatted = formatDate(new Date().toISOString());

    const activeAgendamentos = sortedAgendamentos.filter(agendamento => {
        const isPast = isPastAgendamento(agendamento.dataAgendamento);
        const isCanceled = isCanceledAgendamento(agendamento.status);
        return !(isPast || isCanceled); // Mantém apenas os agendamentos ativos
    });

    const inactiveAgendamentos = sortedAgendamentos.filter(agendamento => {
        const isPast = isPastAgendamento(agendamento.dataAgendamento);
        const isCanceled = isCanceledAgendamento(agendamento.status);
        return isPast || isCanceled; // Mantém apenas os agendamentos inativos
    });

    return (
        <div className="agendamentos-page">
            <Header /> {/* Inclui o cabeçalho */}
            <main className="main-content">
                <h1>Meus Agendamentos</h1>
                {error && <p className="error-message">{error}</p>}

                {/* Se não houver agendamentos, mostrar mensagem */}
                {sortedAgendamentos.length === 0 ? (
                    <p>Você não tem agendamentos no momento.</p>
                ) : (
                    <>
                        {/* Exibir agendamentos ativos */}
                        {activeAgendamentos.length > 0 && (
                            <>
                                <h2 className="active-agendamentos-title">Agendamentos posteriores a {todayFormatted}</h2>
                                <div className="agendamentos-cards-container">
                                    {activeAgendamentos.map((agendamento) => (
                                        <div
                                            className="agendamento-card"
                                            key={agendamento.id}
                                        >
                                            <div className="card-header">
                                                <h3>{agendamento.servicoSubCategoria.nome}</h3>
                                                <div className="action-icons">
                                                    <FaEye
                                                        className="view-icon"
                                                        title="Visualizar Detalhes"
                                                        onClick={() => handleViewDetails(agendamento.id)}
                                                    />
                                                    <FaTimes
                                                        className="cancel-icon"
                                                        title="Cancelar Agendamento"
                                                        onClick={() => handleCancel(agendamento.id)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Data:</strong> {formatDate(agendamento.dataAgendamento)}</p>
                                                <p><strong>Hora:</strong> {agendamento.horaAgendamento}</p>
                                                <p><strong>Status:</strong> {agendamento.status}</p>
                                                <p><strong>Usuário ID:</strong> {agendamento.usuarioId}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Linha de separação */}
                        {activeAgendamentos.length > 0 && inactiveAgendamentos.length > 0 && (
                            <hr />
                        )}

                        {/* Exibir agendamentos inativos */}
                        {inactiveAgendamentos.length > 0 && (
                            <>
                                <h2 className="inactive-agendamentos-title">Agendamentos anteriores a {todayFormatted}</h2>
                                <div className="agendamentos-cards-container">
                                    {inactiveAgendamentos.map((agendamento) => (
                                        <div
                                            className={`agendamento-card past-agendamento`}
                                            key={agendamento.id}
                                        >
                                            <div className="card-header">
                                                <h3>{agendamento.servicoSubCategoria.nome}</h3>
                                                <div className="action-icons">
                                                    <FaEye
                                                        className="view-icon"
                                                        title="Visualizar Detalhes"
                                                        onClick={undefined} // Desabilitado
                                                    />
                                                    <FaTimes
                                                        className="cancel-icon"
                                                        title="Cancelar Agendamento"
                                                        onClick={undefined} // Desabilitado
                                                    />
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Data:</strong> {formatDate(agendamento.dataAgendamento)}</p>
                                                <p><strong>Hora:</strong> {agendamento.horaAgendamento}</p>
                                                <p><strong>Status:</strong> {agendamento.status}</p>
                                                <p><strong>Usuário ID:</strong> {agendamento.usuarioId}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </main>

            <footer className="footer">
                <p>&copy; 2024 BelezaMarket - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default AgendamentosPage;
