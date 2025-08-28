import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get('/api/auth/check');
            if (data.success) {
                // Backend returns { user }
                setAuthUser(data.user);
                connectSocket(data.user);
            } else {
                toast.error(data.message || 'Authentication check failed');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                logout(false);
            }
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Logout function to handle user logout and socket disconnections
    const logout = (showToast = true) => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common['token'];
        if (showToast) toast.success("Logged out successfully");
        try {
            socket?.disconnect();
    } catch {
            // ignore disconnect errors
        }
    };

    // Update Profile function to handle user profile updates
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put('/api/auth/update-profile', body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Login function to handle user authentications and socket connections
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                axios.defaults.headers.common['token'] = data.token;
                setAuthUser(data.user);
                connectSocket(data.user);
                toast.success(state === 'login' ? 'Login successful' : 'Account created');
            } else {
                toast.error(data.message || 'Authentication failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Connect socket function to handle socket connections and online users updates
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on('getOnlineUsers', (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    useEffect(() => {
        if (!token) return;
        axios.defaults.headers.common['token'] = token;
        checkAuth();
    }, [token]);

    const value = {
        backendUrl,
        axios,
        token,
        authUser,
        setAuthUser,
        setToken,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};