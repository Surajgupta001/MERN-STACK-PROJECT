import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {

    const navigate = useNavigate();

    // Auth States
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Auth Actions
    const checkSession = async () => {
        try {
            const { data } = await api.get("/api/auth/me");
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const login = async (emailAddress, password) => {
        try {
            const { data } = await api.post("/api/auth/login", { emailAddress, password });
            setUser(data.user);
            toast.success("Welcome back!");
            navigate("/");
        } catch (error) {
            console.error('Login error:', error);
            const errMsg = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    };

    const register = async (name, emailAddress, password) => {
        try {
            const { data } = await api.post("/api/auth/register", { name, emailAddress, password });
            setUser(data.user);
            toast.success("Account created successfully!");
            navigate("/");
        } catch (error) {
            console.error('Registration error:', error);
            const errMsg = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    };

    return (
        <AppContext.Provider value={{
            user,
            loadingUser,
            login,
            register,
        }}>
            {children}
        </AppContext.Provider>
    )
};

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
}