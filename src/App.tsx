import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import CampoTexto from './componentes/CampoTexto';

interface ServicoSubCategoria {
  id: number;
  nome: string;
  duracao: string;
  valor: number;
  servicoCategoriaId?: number;
}

interface ServicoCategoria {
  id: number;
  nome: string;
}

function App() {
  const [services, setServices] = useState<ServicoSubCategoria[]>([]);
  const [categories, setCategories] = useState<ServicoCategoria[]>([]);
  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('');
  const [valor, setValor] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editServiceId, setEditServiceId] = useState<number | null>(null);

  const fetchServices = async () => {
    try {
      const response = await axios.get<ServicoSubCategoria[]>('https://localhost:7265/api/SSubCategorias');
      setServices(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get<ServicoCategoria[]>('https://localhost:7265/api/Servicos');
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const handleCreateOrUpdateService = async () => {
    if (!nome || !duracao || !valor || !selectedCategoryId) {
      alert('Preencha todos os campos');
      return;
    }

    const serviceData = {
      id: editServiceId || undefined, // Inclua o ID se estiver editando
      nome,
      duracao: duracao.trim(),
      valor: parseFloat(valor),
      servicoCategoriaId: selectedCategoryId,
    };

    try {
      if (isEditing && editServiceId !== null) {
        console.log('Atualizando serviço:', editServiceId, serviceData);

        // Atualizar serviço existente
        await axios.put(`https://localhost:7265/api/SSubCategorias/${editServiceId}`, serviceData);
        await fetchServices(); // Recarrega todos os serviços
        resetForm(); // Limpa o formulário e retorna ao modo de criação
      } else {
        console.log('Criando novo serviço:', serviceData);

        // Criar novo serviço
        const response = await axios.post(
          'https://localhost:7265/api/SSubCategorias',
          serviceData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        setServices([...services, response.data]);
        resetForm(); // Limpa o formulário após a criação
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Detalhes do erro:", error.response.data);
        alert(`Erro ao criar/atualizar o serviço: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error("Erro desconhecido:", error);
        alert("Erro ao criar/atualizar o serviço. Verifique os dados.");
      }
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7265/api/SSubCategorias/${id}`);
      setServices(services.filter(service => service.id !== id));
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      alert("Erro ao deletar serviço");
    }
  };

  const handleEditService = (service: ServicoSubCategoria) => {
    setNome(service.nome);
    setDuracao(service.duracao);
    setValor(service.valor.toString());
    setSelectedCategoryId(service.servicoCategoriaId ?? '');
    const category = categories.find((cat) => cat.id === service.servicoCategoriaId);
    setSelectedCategoryName(category ? category.nome : ''); // Define o nome da categoria
    setIsEditing(true);
    setEditServiceId(service.id);
  };

  const resetForm = () => {
    setNome('');
    setDuracao('');
    setValor('');
    setSelectedCategoryId('');
    setSelectedCategoryName('');
    setIsEditing(false);
    setEditServiceId(null);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="logo">BelezaMarket</div>
        <button className="account-button">Minha conta</button>
      </header>
      <main className="content">
        <section className="form-section">
          <h2>{isEditing ? "Edite o serviço" : "Cadastre um novo serviço"}</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Digite o nome do serviço"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="text"
              placeholder="Digite a duração do serviço (HH:mm:ss)"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
            />
            <input
              type="text"
              placeholder="Digite o preço do serviço"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
            {isEditing ? (
              <input
                type="text"
                value={selectedCategoryName}
                disabled
              />
            ) : (
              <select
                value={selectedCategoryId ?? ''}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              >
                <option value="" disabled>Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nome}
                  </option>
                ))}
              </select>
            )}
            <div className="button-group">
              <button type="button" onClick={handleCreateOrUpdateService}>
                {isEditing ? "Atualizar Serviço" : "Criar Serviço"}
              </button>
            </div>
          </form>
        </section>
        <section className="services-list">
          <h3>Serviços Cadastrados:</h3>
          {services.length === 0 ? (
            <p>Nenhum serviço cadastrado.</p>
          ) : (
            <ul>
              {services.map((service) => (
                <li key={service.id} className="service-card">
                  <button className="delete-button" onClick={() => handleDeleteService(service.id)}>×</button>
                  <button className="edit-button" onClick={() => handleEditService(service)}>✏️</button>
                  <h4>{service.nome}</h4>
                  <p>Duração: {formatDuration(service.duracao)}</p>
                  <p>Preço: R${service.valor.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <CampoTexto/>
    </div>
  );
}

// Função auxiliar para formatar a duração
const formatDuration = (duration: string) => {
  const [hours, minutes] = duration.split(':');
  return `${hours}h ${minutes}min`;
};

export default App;





