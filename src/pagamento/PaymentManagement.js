import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PaymentManagement.css';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);


  useEffect(() => {
    fetch('/api/Pagamentos') 
      .then((response) => response.json())
      .then((data) => setPayments(data))
      .catch((error) => console.error('Erro ao buscar pagamentos:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`/api/Pagamentos/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao excluir pagamento');
        setPayments(payments.filter((payment) => payment.id !== id));
      })
      .catch((error) => console.error('Erro ao excluir pagamento:', error));
  };

  return (
    <div className="salon-list-container">
      <header className="header">
        <h1>BelezaMarket</h1>
      </header>

      <h2>Gestão de Pagamentos</h2>
      <Link to="/payment-form">
        <button className="new-salon-button">Cadastrar Novo Pagamento</button>
      </Link>

      <div className="salon-list">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div key={payment.id} className="salon-card">
              <h3>Modo de Pagamento: {payment.modoPagamento}</h3>
              <p><strong>Data:</strong> {new Date(payment.dataPagamento).toLocaleDateString()}</p>
              <p><strong>Valor:</strong> R$ {payment.valor.toFixed(2)}</p>
              <div className="actions">
                <Link to={`/payment-form/${payment.id}`}>
                  <button className="edit-button">Editar</button>
                </Link>
                <button className="delete-button" onClick={() => handleDelete(payment.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum pagamento cadastrado ainda.</p>
        )}
      </div>

      <footer className="footer">
        <p>@2024 Beleza Market - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default PaymentManagement;
