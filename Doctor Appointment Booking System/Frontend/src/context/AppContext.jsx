import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(false);

    const getDoctorsData = async () => {

        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list');

            if (data.success) {
                setDoctors(data.data);
                console.log("Doctors fetched successfully:", data.data);
                toast.success("Doctors fetched successfully");
            } else {
                console.error("Failed to fetch doctors:", data.message);
                toast.error("Failed to fetch doctors");
            }

        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } });
            if (data.success) {
                setUserData(data.userData);
                console.log("User profile data loaded successfully:", data.userData);
                toast.success("User profile data loaded successfully");
            } else {
                console.error("Failed to load user profile data:", data.message);
                toast.error("Failed to load user profile data");
            }

        } catch (error) {
            console.error("Error loading user profile data:", error);
            toast.error("Failed to load user profile data");
        }
    };

    const value = {
        doctors,
        currencySymbol,
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        getDoctorsData,
        loadUserProfileData,
    };

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(false);
        }
    }, [token]);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;