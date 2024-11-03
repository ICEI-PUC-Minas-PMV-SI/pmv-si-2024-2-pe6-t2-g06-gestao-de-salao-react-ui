import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SalonList.css';

function SalonList() {
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    fetch('http://localhost:7135/api/Saloes')
      .then((response) => response.json())
      .then((data) => setSalons(data))
      .catch((error) => console.error('Erro ao buscar salões:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:7135/api/Saloes/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao excluir salão');
        setSalons(salons.filter((salon) => salon.id !== id));
      })
      .catch((error) => console.error('Erro ao excluir salão:', error));
  };

  return (
    <div className="salon-list-container">
      <header className="header">
        <h1>BelezaMarket</h1>
      </header>

      <h2>Lista de Salões</h2>
      <Link to="/salon-form">
        <button className="new-salon-button">Cadastrar Novo Salão</button>
      </Link>

      <div className="salon-list">
        {salons.length > 0 ? (
          salons.map((salon) => (
            <div key={salon.id} className="salon-card">
              <h3>{salon.nome}</h3>
              <p>{salon.endereco}</p>
              <div className="actions">
                <Link to={`/salon-form/${salon.id}`}>
                  <button className="edit-button">Editar</button>
                </Link>
                <button className="delete-button" onClick={() => handleDelete(salon.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum salão cadastrado ainda.</p>
        )}
      </div>

      <footer className="footer">
        <p>@2024 Beleza Market - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default SalonList;
