import React, { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User"; // Ensure this type includes only the necessary properties
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    loginUser: (email: string, senha: string) => Promise<string>; // Return userId as a string
    logout: () => void;
    isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
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
    const loginUser = async (email: string, senha: string): Promise<string> => {
        try {
            const res = await loginAPI(email, senha);
            if (res) {
                const { jwtToken, userId } = res; // Correctly extract jwtToken and userId

                // Save token and user data to local storage
                localStorage.setItem("token", jwtToken);
                localStorage.setItem("userId", userId);

                const userObj: UserProfile = { email, senha, userId }; // Create a user profile object without password for security

                // Set state and axios authorization header
                setToken(jwtToken);
                setUser(userObj);
                axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

                // toast.success("Login Successful!");

                // Return the userId for redirection
                return userId;
            } else {
                throw new Error("Invalid login response");
            }
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            throw new Error(errorMessage); // Throw error to propagate back to the LoginPage for handling
        }
    };

    // Function to get error message
    const getErrorMessage = (error: any): string => {
        if (error.response) {
            console.error("Login error:", error.response.data);
            return "Login failed: " + error.response.data.message;
        } else if (error.request) {
            console.error("No response received:", error.request);
            return "No response from server. Please try again later.";
        } else {
            console.error("Error:", error.message);
            return "An error occurred during login.";
        }
    };

    // Check if user is logged in
    const isLoggedIn = () => !!token; // Check if token exists to determine login status

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common["Authorization"]; // Clear the authorization header
        navigate("/"); // Redirect to homepage after logout
    };

    return (
        <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn }}>
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

// Hook to use the authentication context
export const useAuth = () => React.useContext(UserContext);
