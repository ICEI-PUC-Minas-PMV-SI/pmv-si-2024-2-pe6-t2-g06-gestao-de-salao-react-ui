// agendamentosAPI.ts

export const getAgendamentosAPI = async (token: string, userId: number) => {
  try {
    const response = await fetch(`https://localhost:5001/gateway/agendamentos/usuario/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching agendamentos:', error);
    throw error;
  }
};

// Função para cancelar um agendamento
// Função para cancelar um agendamento
export const cancelAgendamentoAPI = async (token: string, agendamentoId: number) => {
  try {
    const response = await fetch(`https://localhost:5001/gateway/agendamentos/${agendamentoId}/cancelar`, {
      method: 'PATCH', // Usando PATCH se o cancelamento atualiza o status, ou DELETE para remoção completa
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Verificar se há um corpo de resposta
    const data = response.status !== 204 ? await response.json() : null; // status 204 indica sem conteúdo
    console.log('Agendamento cancelado:', data);
    return data;
  } catch (error) {
    console.error('Error canceling agendamento:', error);
    throw error;
  }
};

