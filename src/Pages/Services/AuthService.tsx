// Adapted loginAPI usingy
export const loginAPI = async (email: string, senha: string) => {
  try {
    const response = await fetch('https://localhost:5001/gateway/Usuarios/authentication', {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json', // Set the content type
        'Accept': 'application/json' // Ensure the server knows we're expecting JSON in response
      },
      body: JSON.stringify({
        email: email,
        senha: senha // Explicitly name the keys for the object
      }) // Convert the object to a JSON string
    });

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON from the response
    console.log(data); // Log the response data
    return data; // Return the data object
  } catch (error) {
    console.error('Error during login:', error); // Log the error for debugging
    throw error; // Re-throw the error to be handled in useAuth.tsx
  }
};