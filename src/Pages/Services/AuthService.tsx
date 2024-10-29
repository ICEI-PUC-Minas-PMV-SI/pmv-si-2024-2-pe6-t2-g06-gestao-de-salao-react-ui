// Services/AuthService.ts
export const loginAPI = async (email: string, senha: string) => {
  try {
    const urlAuthentication = 'https://localhost:7291/api/Usuarios/authenticate'
    const response = await fetch(urlAuthentication, {
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