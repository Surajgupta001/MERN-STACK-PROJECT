import React, { useCallback, useEffect, useState } from 'react'
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function ManageBookings() {

  const { currency, axios, isOwner, token } = useAppContext();

  const [bookings, setBookings] = useState([]);

  const fetchOwnerBookings = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const msg = error?.response?.data?.message || 'Failed to fetch bookings.';
      toast.error(msg);
    }
  }, [axios]);

  const checkBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
      if(data.success){
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      const msg = error?.response?.data?.message || 'Failed to update booking status.';
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (token && isOwner) {
      fetchOwnerBookings();
    }
  }, [token, isOwner, fetchOwnerBookings]);

  return (
    <div className='w-full px-4 pt-10 md:px-10'>
      <Title title='manage bookings' subtitle='Track all customer bookings, approve or cancel requests, and manage booking status.' />
      <div className='w-full max-w-3xl mt-6 overflow-hidden border rounded-md border-borderColor'>
        <table className='w-full text-sm text-left text-gray-600 border-collapse'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className='text-gray-500 border-t border-borderColor'>
                <td className='flex items-center gap-3 p-3'>
                  <img src={booking.car.image} alt="" className='object-cover w-12 h-12 rounded-md aspect-square' />
                  <p className='font-medium max-md:hidden'>{booking.car.brand} {booking.car.model}</p>
                </td>
                <td className='p-3 max-md:hidden'>
                  <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                </td>
                <td className='p-3'>
                  <p className='font-medium'>{currency}{booking.price}</p>
                </td>
                <td className='p-3 max-md:hidden'>
                  <span className='px-3 py-1 text-xs bg-gray-100 rounded-full'>Offline</span>
                </td>
                <td className='p-3'>
                  {booking.status === 'pending' ? (
                    <select onChange={(e) => checkBookingStatus(booking._id, e.target.value)} value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${booking.status === 'confirmed' ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`}>{booking.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings
