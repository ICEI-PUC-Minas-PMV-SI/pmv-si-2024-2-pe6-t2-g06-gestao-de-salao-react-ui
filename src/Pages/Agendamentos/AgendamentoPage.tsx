import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/useAuth';
import { getAgendamentosAPI } from '../api/AgendamentoAPI';
import Header from '../../Components/Header';
import { FaEye, FaTimes } from 'react-icons/fa';
import AgendamentoViewDetailsModal from '../../Pages/Agendamentos/AgendamentoViewDetailsModal';
import '../Agendamentos/AgendamentoPage.css';

const AgendamentosPage: React.FC = () => {
    const { token, user } = useAuth();
    const userId = user?.userId;
    const [agendamentos, setAgendamentos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAgendamento, setSelectedAgendamento] = useState<any | null>(null);

    useEffect(() => {
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

        fetchAgendamentos();
    }, [token, userId]);

    const handleCancel = (id: number) => {
        console.log(`Cancelando agendamento com id: ${id}`);
    };

    const handleViewDetails = (agendamento: any) => {
        setSelectedAgendamento(agendamento);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedAgendamento(null);
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
        </div>
    );
};

export default AgendamentosPage;
