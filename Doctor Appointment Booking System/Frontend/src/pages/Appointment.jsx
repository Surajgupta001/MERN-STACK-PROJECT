import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

function Appointment() {

    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const navigate = useNavigate();

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId);
        setDocInfo(docInfo);
    }

    const getAvailableSlots = async () => {
        if (!docInfo || !docInfo.slots_booked) {
            return;
        }
        
        setDocSlots([]);

        // Getting the current date
        let today = new Date();

        for (let i = 0; i < 7; i++) {

            // date with index
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // setting the end time of the date with index
            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            // Setting hours
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            }
            else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate <= endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate(); // Fixed: use getDate() not getDay()
                let month = currentDate.getMonth() + 1; // Months are zero-based
                let year = currentDate.getFullYear();

                const slotDate = `${day}-${month}-${year}`;
                const slotTime = formattedTime;
                
                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;
                
                if (isSlotAvailable) {
                    // If slot is available, add it to the timeSlots array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    });
                }
                
                // Increment the time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            setDocSlots(prev => ([...prev, timeSlots]));
        }
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warn("Please login to book an appointment");
            return navigate('/login');
        }

        try {
            const date = docSlots[slotIndex][0].datetime;

            let day = date.getDate();
            let month = date.getMonth() + 1; // Months are zero-based
            let year = date.getFullYear();

            const slotDate = `${day}-${month}-${year}`;
            
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message);
                getDoctorsData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            } 

        } catch (error) {
            console.error("Error booking appointment:", error);
            toast.error("Failed to book appointment");
        }
    };

    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    return docInfo && (
        <div>
            <div className='flex flex-col gap-4 sm:flex-row'>
                <div>
                    <img className='w-full rounded-lg bg-primary sm:max-w-72' src={docInfo?.image} alt="" />
                </div>
                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo?.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo?.degree} - {docInfo?.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo?.experience}</button>
                    </div>
                    <div>
                        <p className='flex items-center gap-1 mt-3 text-sm font-medium text-gray-900'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo?.about}</p>
                    </div>
                    <p className='mt-4 font-medium text-gray-600'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo?.fees}</span></p>
                </div>
            </div>
            <div className='mt-8 font-medium text-gray-700 sm:ml-72 sm:pl-4'>
                <p>Booking Slots</p>
                <div className='flex items-center w-full gap-3 mt-4 overflow-x-scroll'>
                    {docSlots.length && docSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}>
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>
                <div className='flex items-center w-full gap-3 mt-4 overflow-x-scroll'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>
                <button onClick={bookAppointment} className='px-20 py-3 my-6 text-sm font-light text-white rounded-full bg-primary'>Book Appointment</button>
            </div>
            <RelatedDoctors docId={docId} speciality={docInfo?.speciality} />
        </div>
    )
}

export default Appointment
