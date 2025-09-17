import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupdate, setPickupDate] = useState('');
    const [returndate, setReturnDate] = useState('');

    const [cars, setCars] = useState([]);

    // Function to check if user is logged in
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/users/data');
            if(data.success){
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Session expired. Please log in again.");
        }
    };

    // Function to fetch cars from the server
    const fetchCars = async () => {
        try {
            const { data } = await axios.get('/api/users/cars');
            data.success ? setCars(data.cars) : toast.error(data.message);
        } catch (error) {
            console.error("Error fetching cars:", error);
            toast.error("Failed to fetch cars.");
        }
    };

    // Function to logout the user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common['Authorization'] = '';
        toast.success("Logged out successfully.");
    };

    // useEffect to receive the token from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        fetchCars();
    }, [])

    // useEffect to fetch user data when token is available
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `${token}`;
            fetchUser();
        }
    }, [token])



    const value = {
        navigate,
        currency,
        token,
        user,
        isOwner,
        setToken,
        setUser,
        setIsOwner,
        showLogin,
        setShowLogin,
        pickupdate,
        setPickupDate,
        returndate,
        setReturnDate,
        cars,
        setCars,
        fetchUser,
        fetchCars,
        logout,
        axios
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export const useAppContext = () => {
    return useContext(AppContext);
};