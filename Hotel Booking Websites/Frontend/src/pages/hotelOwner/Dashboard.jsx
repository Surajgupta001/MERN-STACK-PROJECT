import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'

function Dashboard() {

    const [dashboardData, setDashboardData] = useState(dashboardDummyData);

    return (
        <div>
            <Title align='left' font='outfit' title='Dashboard' subtitle='Manage your room listing, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations.' />
            <div className='flex gap-4 my-8'>
                {/* Total Booking */}
                <div className='flex p-4 pr-8 border rounded bg-primary/3 border-primary/10'>
                    <img src={assets.totalBookingIcon} alt="" className='h-10 max-sm:hidden' />
                    <div className='flex flex-col font-medium sm:ml-4'>
                        <p className='text-lg text-blue-500'>Total Bookings</p>
                        <p className='text-base text-neutral-400'>{dashboardData.totalBookings}</p>
                    </div>
                </div>
                {/* Total Revenue */}
                <div className='flex p-4 pr-8 border rounded bg-primary/3 border-primary/10'>
                    <img src={assets.totalRevenueIcon} alt="" className='h-10 max-sm:hidden' />
                    <div className='flex flex-col font-medium sm:ml-4'>
                        <p className='text-lg text-blue-500'>Total Revenue</p>
                        <p className='text-base text-neutral-400'>$ {dashboardData.totalRevenue}</p>
                    </div>
                </div>
            </div>
            {/* Recent Booking */}
            <h2 className='mb-5 text-xl font-medium text-blue-950/70'>Recent Bookings</h2>
            <div className='w-full max-w-3xl overflow-y-scroll text-left border border-gray-300 rounded-lg max-h-80'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-4 py-3 font-medium text-gray-800'>User Name</th>
                            <th className='px-4 py-3 font-medium text-gray-800 max-sm:hidden'>Room Name</th>
                            <th className='px-4 py-3 font-medium text-center text-gray-800'>Total Amount</th>
                            <th className='px-4 py-3 font-medium text-center text-gray-800'>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {dashboardData.bookings.map((item, index) => (
                            <tr key={index}>
                                <td className='px-4 py-3 text-gray-700 border-t border-gray-300'>{item.user.username}</td>
                                <td className='px-4 py-3 text-gray-700 border-t border-gray-300 max-sm:hidden'>{item.room.roomType}</td>
                                <td className='px-4 py-3 text-center text-gray-700 border-t border-gray-300'>$ {item.totalPrice}</td>
                                <td className='flex px-4 py-3 border-t border-gray-300'>
                                    <button className={`px-3 py-1 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-600'}`}>{item.isPaid ? 'Completed' : 'Pending'}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard
