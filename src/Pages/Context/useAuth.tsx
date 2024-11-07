// Context/UserProvider.tsx
import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User"; // Import the updated UserProfile
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    loginUser: (email: string, senha: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Load stored token and user data from local storage on initial mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
        setIsReady(true); // Indicate that the user context is ready
    }, []);

    // Login function
    const loginUser = async (email: string, senha: string) => {
        try {
            const res = await loginAPI(email, senha);

            if (res) {
                const { token, email, userName, userId } = res; // Include userId in destructuring

                // Save token and user data to local storage
                localStorage.setItem("token", token);

                const userObj: UserProfile = { email, senha, userId }; // Set userId in UserProfile

                // Optionally save the user object to local storage
                localStorage.setItem("user", JSON.stringify(userObj));

                // Set state and axios authorization header
                setToken(token);
                setUser(userObj); // This should match the UserProfile structure
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                // toast.success("Login Successful!");
                navigate("/search"); // Redirect after login
            }
        } catch (error: any) {
            if (error.response) {
                // Server responded with a status code outside of the 2xx range
                console.error("Login error:", error.response.data);
                toast.error("Login failed: " + error.response.data.message);
            } else if (error.request) {
                // Request was made but no response received
                console.error("No response received:", error.request);
                toast.error("No response from server. Please try again later.");
            } else {
                // Something else happened during the request
                console.error("Error:", error.message);
                toast.error("An error occurred during login.");
            }
        }
    };

    // Check if user is logged in
    const isLoggedIn = () => !!user;

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        navigate("/"); // Redirect to homepage after logout
    };

    return (
        <UserContext.Provider
            value={{ loginUser, user, token, logout, isLoggedIn }}
        >
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

// Hook to use the authentication context
export const useAuth = () => React.useContext(UserContext);
