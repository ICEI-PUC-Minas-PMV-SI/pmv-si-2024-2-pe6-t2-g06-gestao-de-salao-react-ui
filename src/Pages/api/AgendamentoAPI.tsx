// agendamentosAPI.ts
export const getAgendamentosAPI = async (token: string, userId: number) => {
    try {
      const response = await fetch(`https://localhost:5001/gateway/agendamentos/usuario/${userId}`, {
        method: 'GET', // Usamos GET para pegar os dados
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo esperado
          'Authorization': `Bearer ${token}`, // Adicionando o token no cabeçalho
          'Accept': 'application/json' // Aceitando resposta em JSON
        }
      });
  
      // Verificando se a resposta é OK (status no intervalo de 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Fazendo parse do JSON na resposta
      console.log(data); // Logando os dados recebidos
      return data; // Retornando os dados dos agendamentos
    } catch (error) {
      console.error('Error fetching agendamentos:', error); // Logando o erro para debug
      throw error; // Relançando o erro para tratamento em outro lugar
    }
  };
  