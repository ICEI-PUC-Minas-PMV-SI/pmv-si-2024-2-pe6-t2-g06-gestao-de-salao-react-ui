import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterUsuarioPage.css';
import { registerUser } from '../api/UsuarioAPI'; // Função para registrar o usuário

interface Usuario {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  dataNascimento: string;
  genero: number;
  perfil: number;
  cnpj: string; // Campo CNPJ
}

const generoOptions = [
  { label: 'Masculino', value: 0 },
  { label: 'Feminino', value: 1 },
  { label: 'Outro', value: 2 },
];

const perfilOptions = [
  
  { label: 'Profissional', value: 0 },
  { label: 'Administrador', value: 1 },
];

const CadastroUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    dataNascimento: '',
    genero: generoOptions[0].value,
    perfil: perfilOptions[0].value,
    cnpj: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCNPJValid, setIsCNPJValid] = useState(false); // Estado para validar o CNPJ

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  // Função para validar CNPJ através de API
  const handleCNPJValidation = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await fetch(`https://localhost:5001/gateway/saloes/${usuario.cnpj}`);
      const data = await response.json();

      if (response.ok ) {
        setIsCNPJValid(true);
      } else {
        setErrorMessage('CNPJ não encontrado ou inválido teste.'); // Mensagem de erro se o CNPJ não for válido
        setIsCNPJValid(false);
      }
    } catch (error) {
      setErrorMessage('Erro ao validar CNPJ.'); // Tratamento de erro
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await registerUser(usuario); // Passa os dados do usuário para registerUser
      setIsLoading(false);
      navigate(`/login`);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Cadastro falhou. Por favor, tente novamente.');
    }
  };

  return (
    <div className='all'>
      <div className="login-section">
        <div className="navbar">
          <div className="container">
            <div className="logo">Cadastro de Profissionais</div>
          </div>
        </div>
        <div className="cadastro-section">
          <div className="cadastro-card">
            <div className="cadastro-content">
              <form className="cadastro-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">CNPJ:</label>
                    <input
                      type="text"
                      name="cnpj"
                      className="form-input"
                      value={usuario.cnpj}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" onClick={handleCNPJValidation} disabled={isLoading}>
                      Validar CNPJ
                    </button>
                  </div>
                </div>

                {/* Outros campos do formulário */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome:</label>
                    <input
                      type="text"
                      name="nome"
                      className="form-input"
                      value={usuario.nome}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={usuario.email}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Senha:</label>
                    <input
                      type="password"
                      name="senha"
                      className="form-input"
                      value={usuario.senha}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone:</label>
                    <input
                      type="tel"
                      name="telefone"
                      className="form-input"
                      value={usuario.telefone}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Endereço:</label>
                    <input
                      type="text"
                      name="endereco"
                      className="form-input"
                      value={usuario.endereco}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cidade:</label>
                    <input
                      type="text"
                      name="cidade"
                      className="form-input"
                      value={usuario.cidade}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Estado:</label>
                    <input
                      type="text"
                      name="estado"
                      className="form-input"
                      value={usuario.estado}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CEP:</label>
                    <input
                      type="text"
                      name="cep"
                      className="form-input"
                      value={usuario.cep}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Data de Nascimento:</label>
                    <input
                      type="date"
                      name="dataNascimento"
                      className="form-input"
                      value={usuario.dataNascimento}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gênero:</label>
                    <select
                      name="genero"
                      className="form-input"
                      value={usuario.genero}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    >
                      {generoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Perfil:</label>
                    <select
                      name="perfil"
                      className="form-input"
                      value={usuario.perfil}
                      onChange={handleChange}
                      required
                      disabled={!isCNPJValid} // Desabilitar se o CNPJ não for válido
                    >
                      {perfilOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="button" disabled={!isCNPJValid || isLoading}>
                  Cadastrar
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroUsuario;
