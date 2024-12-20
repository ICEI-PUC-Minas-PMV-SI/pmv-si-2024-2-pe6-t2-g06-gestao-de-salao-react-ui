import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/useAuth';
import { getAgendamentosAPI } from '../api/AgendamentoAPI';
import Header from '../../Components/Header';
import { FaEye, FaPlus, FaTimes } from 'react-icons/fa';
import AgendamentoViewDetailsModal from '../../Pages/Agendamentos/AgendamentoViewDetailsModal';
import AgendamentoCreateModal from '../../Pages/Agendamentos/AgendamentoCreateModal'; // Importação da modal de criação
import '../Agendamentos/AgendamentoPage.css';
import { cancelAgendamentoAPI } from '../api/AgendamentoAPI';

const AgendamentosPage: React.FC = () => {
    const { token, user } = useAuth();
    const userId = user?.userId;
    const [agendamentos, setAgendamentos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAgendamento, setSelectedAgendamento] = useState<any | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false); // Estado para a modal de criação

    // Função para buscar agendamentos
    const fetchAgendamentos = async () => {
        const localStorageToken = localStorage.getItem("token");
        const storedUserId = Number(localStorage.getItem("userId"));

        if (!localStorageToken || !storedUserId) {
            setError('Token ou ID de usuário ausente.');
            setLoading(false);
            return;
        }

        try {
            const data = await getAgendamentosAPI(localStorageToken, storedUserId);
            setAgendamentos(data);
        } catch (error) {
            setError('Erro ao buscar os agendamentos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgendamentos(); // Chame a função para buscar os agendamentos ao montar o componente
    }, [token, userId]);

    // Função para cancelar agendamento e atualizar a lista
    const handleCancel = async (id: number) => {
        const localStorageToken = localStorage.getItem("token");
        if (!localStorageToken || !id) return;

        try {
            await cancelAgendamentoAPI(localStorageToken, id);
            console.log(`Agendamento com id ${id} cancelado com sucesso.`);
            fetchAgendamentos(); // Chame a função de busca novamente
            // Recarregar a página após o cancelamento
            window.location.reload();
        } catch (error) {
            console.error(`Erro ao cancelar o agendamento com id ${id}:`, error);
        }
    };

    const handleCreateAgendamento = () => {
        setCreateModalOpen(true);
    };

    const handleViewDetails = (agendamento: any) => {
        setSelectedAgendamento(agendamento);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedAgendamento(null);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const isPastAgendamento = (dataAgendamento: string) => {
        const today = new Date();
        const agendamentoDate = new Date(dataAgendamento);
        return agendamentoDate < today;
    };

    const isCanceledAgendamento = (status: string) => status === 'Cancelado';

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    if (loading) {
        return <p>Carregando seus agendamentos...</p>;
    }

    const sortedAgendamentos = agendamentos.sort((b, a) => {
        const dateA = new Date(a.dataAgendamento).getTime();
        const dateB = new Date(b.dataAgendamento).getTime();
        const isConfirmedA = a.status === 'confirmado';
        const isConfirmedB = b.status === 'confirmado';

        if (isConfirmedA && !isConfirmedB) return -1;
        if (!isConfirmedA && isConfirmedB) return 1;

        return dateA - dateB;
    });

    const todayFormatted = formatDate(new Date().toISOString());

    const activeAgendamentos = sortedAgendamentos.filter(agendamento => {
        const isPast = isPastAgendamento(agendamento.dataAgendamento);
        const isCanceled = isCanceledAgendamento(agendamento.status);
        return !(isPast || isCanceled);
    });

    const inactiveAgendamentos = sortedAgendamentos.filter(agendamento => {
        const isPast = isPastAgendamento(agendamento.dataAgendamento);
        const isCanceled = isCanceledAgendamento(agendamento.status);
        return isPast || isCanceled;
    });

    return (
        <div className="agendamentos-page">
            <Header />
            <main className="main-content">
                <h1>Meus Agendamentos</h1>
                <button className="create-agendamento-button" onClick={handleCreateAgendamento}>
                    <FaPlus /> Criar Agendamento
                </button>
                {error && <p className="error-message">{error}</p>}

                {sortedAgendamentos.length === 0 ? (
                    <p>Você não tem agendamentos no momento.</p>
                ) : (
                    <>
                        {activeAgendamentos.length > 0 && (
                            <>
                                <h2 className="active-agendamentos-title">Agendamentos posteriores a {todayFormatted}</h2>
                                <div className="agendamentos-cards-container">
                                    {activeAgendamentos.map((agendamento) => (
                                        <div className="agendamento-card" key={agendamento.id}>
                                            <div className="card-header">
                                                <h3>{agendamento.servicoSubCategoria.nome}</h3>
                                                <div className="action-icons">
                                                    <FaEye
                                                        className="view-icon"
                                                        title="Visualizar Detalhes"
                                                        onClick={() => handleViewDetails(agendamento)}
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
                                                <p><strong>Cliente:</strong> {agendamento.usuario.nome}</p>
                                                <p><strong>Observacoes:</strong> {agendamento.observacoes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activeAgendamentos.length > 0 && inactiveAgendamentos.length > 0 && (
                            <hr />
                        )}

                        {inactiveAgendamentos.length > 0 && (
                            <>
                                <h2 className="inactive-agendamentos-title">Agendamentos anteriores a {todayFormatted}</h2>
                                <div className="agendamentos-cards-container">
                                    {inactiveAgendamentos.map((agendamento) => (
                                        <div className={`agendamento-card past-agendamento`} key={agendamento.id}>
                                            <div className="card-header">
                                                <h3>{agendamento.servicoSubCategoria.nome}</h3>
                                                <div className="action-icons">
                                                    <FaEye className="view-icon" title="Visualizar Detalhes" onClick={() => handleViewDetails(agendamento)} />
                                                    <FaTimes className="cancel-icon" title="Cancelar Agendamento" onClick={() => handleCancel(agendamento.id)} />
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Data:</strong> {formatDate(agendamento.dataAgendamento)}</p>
                                                <p><strong>Hora:</strong> {agendamento.horaAgendamento}</p>
                                                <p><strong>Status:</strong> {agendamento.status}</p>
                                                <p><strong>Cliente:</strong> {agendamento.usuario.nome}</p>
                                                <p><strong>Observacoes:</strong> {agendamento.observacoes}</p>
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

            {selectedAgendamento && (
                <AgendamentoViewDetailsModal
                    open={modalOpen}
                    onClose={closeModal}
                    agendamento={selectedAgendamento}
                />
            )}

            {/* Modal de criação de agendamento */}
            {createModalOpen && (
                <AgendamentoCreateModal
                    open={createModalOpen}
                    onClose={closeCreateModal}
                    agendamento={null} // Adjusted to null
                />
            )}
        </div>
    );
};

export default AgendamentosPage;
