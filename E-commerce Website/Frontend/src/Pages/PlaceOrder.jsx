import React, { useContext, useState } from 'react'
import Title from '../Components/Title'
import CartTotal from '../Components/cartTotal'
import { assets } from '../assets/assets'
import { shopContext } from '../Context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('COD');

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(shopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({
      ...data,
      [name]: value
    }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key id
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        // console.log('Razorpay payment successful:', response);
        try {
          const { data } = await axios.post(backendUrl + '/api/orders/verifyRazorpay', {
            userId: token,
            razorpay_order_id: response.razorpay_order_id
          }, {
            headers: {
              token: token
            }
          });
          if (data.success) {
            navigate('/orders');
            setCartItems({});
          } else {
            navigate('/place-order');
          }
        } catch (error) {
          console.error("Error processing Razorpay payment:", error);
          toast.error("Failed to process payment. Please try again later.");
          navigate('/place-order');
          return;
        }
      }
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {

          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      };

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        // Api Calls for COD
        case 'COD': {
          const response = await axios.post(backendUrl + '/api/orders/place',
            orderData, {
            headers: {
              token: token
            }
          });

          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          }
          else {
            toast.error(response.data.message || "Failed to place order. Please try again.");
          }
          break;
        }

        // Api Calls for Stripe
        case 'Stripe': {
          const responseStripe = await axios.post(backendUrl + '/api/orders/stripe',
            orderData, {
            headers: {
              token: token
            }
          });

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          }
          else {
            toast.error(responseStripe.data.message || "Failed to place order. Please try again.");
          }
          break;
        }

        // Api Calls for Razorpay
        case 'Razorpay': {
          const responseRazorpay = await axios.post(backendUrl + '/api/orders/razorpay',
            orderData, {
            headers: {
              token: token
            }
          });

          if (responseRazorpay.data.success) {
            // console.log("Razorpay Order:", responseRazorpay.data.order);
            initPay(responseRazorpay.data.order);
          }
          else {
            toast.error(responseRazorpay.data.message || "Failed to place order. Please try again.");
          }
          break;
        }

        default:
          break;
      }
    }
    catch (error) {
      console.error("Error processing order items:", error);
      toast.error("Failed to place order. Please try again later.");
      return;
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='First name' required />
          <input onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Last name' required />
        </div>
        <input onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email Address' required />
        <input onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Street' required />
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='City' required />
          <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='State' required />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Zipcode' required />
          <input onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Country' required />
        </div>
        <input onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Phone' required />
      </div>
      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment Method Section */}
          <div className='flex gap-1'>
            <div onClick={() => setMethod('Stripe')} className='flex items-center gap-1 border p-1 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Stripe' ? 'bg-green-500' : ''}`}></p>
              <img className='h-5' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('Razorpay')} className='flex items-center gap-1 border p-1 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Razorpay' ? 'bg-green-500' : ''}`}></p>
              <img className='h-5' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('COD')} className='flex items-center gap-1 border p-1 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'COD' ? 'bg-green-500' : ''}`}></p>
              <p className='text-gray-500 text-xs font-medium'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white text-sm px-16 py-3'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder