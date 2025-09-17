import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function Dashboard() {

  const { axios, currency,  isOwner } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0
  });

  const dashboardCard = [
    {
      title: "Total cars",
      value: data.totalCars,
      icon: assets.carIconColored
    },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored
    },
    {
      title: "Confirmed",
      value: data.completedBookings,
      icon: assets.listIconColored
    }
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('api/owners/dashboard');
      if(data.success){
        setData(data.dashboardData);
      } else{
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data.");
    }
  };

  useEffect(() => {
    if(isOwner){
      fetchDashboardData();
    }
  }, [isOwner])

  return (
    <div className='flex-1 px-4 pt-10 md:px-10'>
      <Title title='Admin Dashboard' subtitle='Monitor overall platform performance including tools car, bookings, revenue and recent activity.' />
      <div className='grid max-w-3xl gap-6 my-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {dashboardCard.map((card, index) => (
          <div key={index} className='flex items-center justify-between gap-2 p-4 border rounded-md border-borderColor'>
            <div>
              <h1 className='text-sm text-gray-500'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
              <img src={card.icon} alt="" className='w-4 h-4' />
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-wrap items-start w-full gap-6 mb-8'>
        {/* Recent Bookings */}
        <div className='w-full max-w-lg p-4 border rounded-md md:p-6 border-borderColor'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-500'>Latest customer bookings</p>
          {data.recentBookings.map((booking, index) => (
            <div key={index} className='flex items-center justify-between mt-4'>
              <div className='flex items-center gap-2'>
                <div className='items-center justify-center hidden w-12 h-12 rounded-full md:flex bg-primary/10'>
                  <img src={assets.listIconColored} alt="" className='w-5 h-5' />
                </div>
                <div>
                  <p>{booking.car.brand} {booking.car.model}</p>
                  <p className='text-sm text-gray-500'>{booking.createdAt.split('T')[0]}</p>
                </div>
              </div>
              <div className='flex items-center gap-2 font-medium'>
                <p className='text-sm text-gray-500'>{currency} {booking.price}</p>
                <p className='px-3 py-0.5 border border-borderColor rounded-full text-sm'>{booking.status}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Monthly Revenue */}
        <div className='w-full p-4 mb-6 border rounded-md md:p-6 border-borderColor md:max-w-xs'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500'>Revenue for current month</p>
          <p className='mt-6 text-3xl font-semibold text-primary'>{currency} {data.monthlyRevenue}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
