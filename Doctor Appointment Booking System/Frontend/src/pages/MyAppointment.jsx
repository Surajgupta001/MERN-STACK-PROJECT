import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyAppointment() {

    const { backendUrl, token, getDoctorsData } = useContext(AppContext);

    const [appointments, setAppointments] = useState([]);
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('-');
        return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2];
    };

    const navigate = useNavigate();

    const getUserAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
                console.log("Appointments fetched successfully:", data.appointments);
                toast.success("Appointments fetched successfully");
            } else {
                console.error("Failed to fetch appointments:", data.message);
                toast.error(data.message);
            }

        } catch (error) {
            console.error("Error fetching user appointments:", error);
            toast.error("An error occurred while fetching appointments");
        }
    };

    // Cancel appointment function

    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } });

            if (data.success) {
                setAppointments((prev) => prev.filter((item) => item._id !== appointmentId));
                toast.success("Appointment cancelled successfully");
                getUserAppointments();
                getDoctorsData();
            } else {
                console.error("Failed to cancel appointment:", data.message);
                toast.error(data.message);
            }

        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast.error("Failed to cancel appointment");
        }

    };

    const initPay = (order) => {

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Doctor Appointment Booking",
            description: "Payment for appointment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                
                try {

                    const { data } = await axios.post(backendUrl + '/api/user/verify-razorpay', response, { headers: { token } });

                    if (data.success) {
                        getUserAppointments();
                        navigate('/my-appointments');
                        toast.success("Payment successfully");
                    }

                } catch (error) {
                    console.error("Error processing payment:", error);
                    toast.error(error.message || "Payment failed");
                }
            }
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const appointmentRazorpay = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/razorpay-payment', { appointmentId }, { headers: { token } });

            if (data.success) {
                initPay(data.order);
            }

        } catch (error) {
            console.error("Error processing Razorpay payment:", error);
            toast.error("Failed to process payment");
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
            <div>
                {appointments.map((item, index) => (
                    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b' key={index}>
                        <div>
                            <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-zinc-600'>
                            <p className='font-medium text-neutral-800'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='mt-1 font-medium text-zinc-700'>Address:</p>
                            <p className='text-xs'>{item.docData.address.line1}</p>
                            <p className='text-xs'>{item.docData.address.line2}</p>
                            <p className='mt-1 text-xs'><span className='text-sm font-medium text-neutral-700'>Date & Time: </span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col justify-end gap-2'>
                            {!item.cancelled && item.payment && !item.isCompleted && <button className='py-2 text-green-500 transition-all duration-300 border border-green-500 rounded sm:min-w-48 hover:bg-green-500 hover:text-white'>Paid</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id)} className='py-2 transition-all duration-300 border rounded text-stone-500 sm:min-w-48 hover:bg-primary hover:text-white'>Pay Online</button>}
                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='py-2 text-red-500 transition-all duration-300 border border-red-500 rounded sm:min-w-48 hover:bg-red-500 hover:text-white'>Cancel Appointment</button>}
                            {item.cancelled && !item.isCompleted && <button className='py-2 text-red-500 transition-all duration-300 border border-red-500 rounded sm:min-w-48 hover:bg-red-500 hover:text-white'>Appointment Cancelled</button>}
                            {item.isCompleted && <button className='py-2 text-green-500 transition-all duration-300 border border-green-500 rounded sm:min-w-48'>Appointment Completed</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointment
