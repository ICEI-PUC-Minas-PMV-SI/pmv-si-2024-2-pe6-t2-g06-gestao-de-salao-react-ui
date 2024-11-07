// Services/AuthService.ts
export const loginAPI = async (email: string, senha: string) => {
  try {
    const response = await fetch('https://localhost:5001/gateway/Usuarios/authentication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure the server returns userId
    return data; // This should now include { token, email, userId }
  } catch (error) {
    console.error('Error during login:', error);
    throw error; 
  }
};