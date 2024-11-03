import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SalonForm.css';

function SalonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    Nome: '',
    Cnpj: '',
    Endereco: '',
    AnoComeco: '',
    AnoCadastro: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {

    if (id) {
      fetch(`http://localhost:7135/api/salons/${id}`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((error) => console.error('Erro ao buscar dados do salão:', error));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let formErrors = {};
    const currentYear = new Date().getFullYear();

    if (formData.Cnpj) {
      const cnpjPattern = /^\d{14}$/;
      if (!cnpjPattern.test(formData.Cnpj)) {
        formErrors.Cnpj = 'CNPJ inválido. Deve conter 14 dígitos numéricos.';
      }
    }

    if (formData.AnoComeco && formData.AnoCadastro) {
      if (Number(formData.AnoComeco) >= Number(formData.AnoCadastro)) {
        formErrors.AnoComeco = 'O ano de início deve ser anterior ao ano de cadastro.';
      }
      if (Number(formData.AnoComeco) > currentYear || Number(formData.AnoCadastro) > currentYear) {
        formErrors.AnoCadastro = 'Ano de cadastro e ano de início não podem ser no futuro.';
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const url = id
        ? `http://localhost:7135/api/salons/${id}`
        : `http://localhost:7135/api/salons`;
      const method = id ? 'PUT' : 'POST';

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Erro ao salvar dados');
          console.log('Dados enviados com sucesso:', formData);
          navigate('/salons');
        })
        .catch((error) => console.error('Erro ao salvar dados:', error));
    }
  };

  return (
    <div className="page-container">
      <header className="header">
        <h1>BelezaMarket</h1>
      </header>

      <main className="salon-form">
        <h2>{id ? 'Editar Salão' : 'Cadastrar Salão'}</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label>
            <input
              type="text"
              name="Nome"
              value={formData.Nome}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>CNPJ:</label>
            <input
              type="text"
              name="Cnpj"
              value={formData.Cnpj}
              onChange={handleInputChange}
              required
            />
            {errors.Cnpj && <p className="error">{errors.Cnpj}</p>}
          </div>

          <div>
            <label>Endereço:</label>
            <input
              type="text"
              name="Endereco"
              value={formData.Endereco}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Ano de Início:</label>
            <input
              type="number"
              name="AnoComeco"
              value={formData.AnoComeco}
              onChange={handleInputChange}
              required
            />
            {errors.AnoComeco && <p className="error">{errors.AnoComeco}</p>}
          </div>

          <div>
            <label>Ano de Cadastro:</label>
            <input
              type="number"
              name="AnoCadastro"
              value={formData.AnoCadastro}
              onChange={handleInputChange}
              required
            />
            {errors.AnoCadastro && <p className="error">{errors.AnoCadastro}</p>}
          </div>

          <button type="submit">Salvar</button>
        </form>
      </main>

      <footer className="footer">
        <p>@2024 Beleza Market - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default SalonForm;
