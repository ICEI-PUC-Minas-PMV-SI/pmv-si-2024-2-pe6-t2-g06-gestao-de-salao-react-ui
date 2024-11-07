export const registerUser = async (userData: object) => {
    try {
        const response = await fetch(`https://localhost:5001/gateway/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Erro ao registrar usuário: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error on register user:', error);
        throw error;
    }
};