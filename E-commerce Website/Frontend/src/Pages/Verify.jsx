import React, { useContext, useEffect } from 'react'
import { shopContext } from '../Context/ShopContext'
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(shopContext);
    const [searchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            if (!token) return null;

            const response = await axios.post(backendUrl + '/api/orders/verifyStripe', {
                success,
                orderId
            }, {
                headers: {
                    token: token
                }
            });

            if (response.data.success) {
                setCartItems({});
                navigate('/orders');
            } else {
                navigate('/cart');
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Failed to verify payment. Please try again later.");
        }
    }

    useEffect(() => {
        if (success === 'false') {
            navigate('/cart');
        } else {
            verifyPayment();
        }
    }, [token, success]);

    return (
        <div>

        </div>
    )
}

export default Verify