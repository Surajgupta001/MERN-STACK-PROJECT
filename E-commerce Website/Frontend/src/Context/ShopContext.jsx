import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const shopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Please select a size for the product');
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/carts/add', { // VITE_BACKEND_URL is now backendUrl
                    itemId: itemId,
                    size: size
                },
                    {
                        headers: {
                            token: token
                        }
                    });
            }
            catch (error) {
                console.error("Error adding to cart:", error);
                toast.error("Failed to add item to cart. Please try again later.");
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            const productExists = products.find(product => product._id === itemId);
            if (productExists) {
                for (const size in cartItems[itemId]) {
                    try {
                        if (cartItems[itemId][size] > 0) {
                            totalCount += cartItems[itemId][size];
                        }
                    }
                    catch (error) {
                        console.error("Error in getCartCount:", error);
                    }
                }
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/carts/update', { // VITE_BACKEND_URL is now backendUrl
                    itemId: itemId,
                    size: size,
                    quantity: quantity
                },
                    {
                        headers: {
                            token: token
                        }
                    });
            }
            catch (error) {
                console.error("Error updating quantity:", error);
                toast.error("Failed to update item quantity. Please try again later.");

            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find(product => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0 && itemInfo) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    console.error("Error in getCartAmount:", error);
                }
            }
        }
        return totalAmount;
    };

    const getProductData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/products/list'); // VITE_BACKEND_URL is now backendUrl

            if (response.data.success) {
                setProducts(response.data.products);
            }
            else {
                toast.error(response.data.message || "Failed to fetch products");
                console.error("Error fetching products:", response.data.message);
            }
        }
        catch (error) {
            toast.error("Failed to fetch products. Please try again later.");
            console.error("Error in getProductData:", error);
        }
    };

    const getUserCart = async (token) => {

        try {
            const response = await axios.post(backendUrl + '/api/carts/get', // VITE_BACKEND_URL is now backendUrl
                {},
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        }
        catch (error) {
            toast.error("Failed to fetch user cart. Please try again later.");
            console.error("Error in getUserCart:", error);
        }
    }

    useEffect(() => {
        getProductData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    }, [token]);

    const value = {
        products,
        setProducts,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken
    };

    return (
        <shopContext.Provider value={value}>
            {props.children}
        </shopContext.Provider>
    );
}

export default ShopContextProvider;