export const registerUser = async (userData: object) => {
    try {
        const response = await fetch(`https://localhost:5001/gateway/saloes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar salao: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error ao buscar salao:', error);
        throw error;
    }
};