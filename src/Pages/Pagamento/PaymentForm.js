import React, { useState, useEffect } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ match }) => {
  const [modoPagamento, setModoPagamento] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [valor, setValor] = useState(0);
  const [tipo, setTipo] = useState(0); 
  const [salaoId, setSalaoId] = useState(0);

  const paymentId = match?.params?.id; 

  
  useEffect(() => {
    if (paymentId) {
      fetch(`/api/Pagamentos/${paymentId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao buscar dados de pagamento');
          }
          return response.json();
        })
        .then((data) => {
          setModoPagamento(data.modoPagamento);
          setDataPagamento(data.dataPagamento.split('T')[0]); 
          setValor(data.valor);
          setTipo(data.tipo);
          setSalaoId(data.salaoId);
        })
        .catch((error) => console.error('Erro ao buscar dados de pagamento:', error));
    }
  }, [paymentId]);


  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentData = {
      modoPagamento,
      dataPagamento,
      valor: parseFloat(valor), 
      tipo: parseInt(tipo, 10), 
      salaoId: parseInt(salaoId, 10), 
      salao: {
        id: salaoId, 
      },
    };

    const method = paymentId ? 'PUT' : 'POST';
    const url = paymentId ? `/api/Pagamentos/${paymentId}` : '/api/Pagamentos'; 

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao salvar dados de pagamento');
        }
        return response.json();
      })
      .then(() => {
        console.log(paymentId ? 'Pagamento atualizado com sucesso!' : 'Pagamento criado com sucesso!');
      })
      .catch((error) => console.error('Erro ao salvar dados de pagamento:', error));
  };

  return (
    <div className="payment-form">
      <header className="header">
        <h1>BelezaMarket</h1>
      </header>
      <h1>{paymentId ? 'Editar Pagamento' : 'Cadastrar Novo Pagamento'}</h1>
      <form onSubmit={handleSubmit}>
        <label>Data de Pagamento</label>
        <input
          type="date"
          value={dataPagamento}
          onChange={(e) => setDataPagamento(e.target.value)}
          required
        />

        <label>Valor</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        <label>Tipo de Pagamento</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          <option value={0}>Cartão de Crédito</option>
          <option value={1}>Cartão de Débito</option>
          <option value={2}>Dinheiro</option>
          <option value={3}>Pix</option>
        </select>

        <label>Modo de Pagamento</label>
        <select value={modoPagamento} onChange={(e) => setModoPagamento(e.target.value)} required>
          <option value="à vista">À vista</option>
          <option value="Parcelamento 2x">Parcelamento 2x</option>
          <option value="Parcelamento 3x">Parcelamento 3x</option>
        </select>

        <label>ID do Salão</label>
        <input
          type="number"
          value={salaoId}
          onChange={(e) => setSalaoId(e.target.value)}
          required
        />

        <button type="submit">Salvar</button>
      </form>
      <footer className="footer">
        <p>@2024 Beleza Market - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default PaymentForm;
