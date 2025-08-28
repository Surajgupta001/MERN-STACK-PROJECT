import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [credit, setCredit] = useState(false);
    const [image, setImage] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const { getToken } = useAuth();
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [resultImage, setResultImage] = useState(false);

    const loadCreditsData = async () => {
        try {
            if (!backendUrl) {
                throw new Error('Backend URL is not configured');
            }
            const token = await getToken();
            if (!token) {
                toast.error('Please sign in to view credits');
                return;
            }
            const { data } = await axios.get(backendUrl + '/api/user/credits', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.success) {
                setCredit(data.credits)
            }
        } catch (error) {
            console.log(error)
            const msg = error?.response?.data?.message || error?.message || 'Failed to load credits';
            toast.error(msg)
        }
    };

    const removeBg = async (image) => {
        try {

            if (!isSignedIn) {
                return openSignIn();
            }

            setImage(image);
            setResultImage(false);

            navigate('/result');
            
        } catch (error) {
            
        }
    };

    const value = {
        credit,
        setCredit,
        loadCreditsData,
        backendUrl,
        image,
        setImage,
        removeBg
    }
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;