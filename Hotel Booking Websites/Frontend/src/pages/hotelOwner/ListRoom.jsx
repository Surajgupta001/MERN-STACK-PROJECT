import React, { useState } from 'react'
import { roomsDummyData } from '../../assets/assets'
import Title from '../../components/Title';

function ListRoom() {

    const [rooms, setRooms] = useState(roomsDummyData);

    return (
        <div>
            <Title align='left' font='outfit' title='Room Listing' subtitle='View, edit, or manage all listed rooms. Keep the information accurate and up-to-date to provide the best experience for users.' />
            <p className='mt-8 text-gray-500'>All Rooms</p>
            <div className='w-full max-w-3xl mt-3 overflow-y-scroll text-left border border-gray-300 rounded-lg max-h-80'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-4 py-3 font-medium text-gray-800'>Name</th>
                            <th className='px-4 py-3 font-medium text-gray-800 max-sm:hidden'>Facility</th>
                            <th className='px-4 py-3 font-medium text-gray-800'>Price / night</th>
                            <th className='px-4 py-3 font-medium text-center text-gray-800'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {rooms.map((item, index) => (
                            <tr key={index}>
                                <td className='px-4 py-3 text-gray-700 border-t border-gray-300'>{item.roomType}</td>
                                <td className='px-4 py-3 text-gray-700 border-t border-gray-300 max-sm:hidden'>{item.amenities.join(', ')}</td>
                                <td className='px-4 py-3 text-gray-700 border-t border-gray-300'>$ {item.pricePerNight}</td>
                                <td className='px-4 py-3 text-sm text-center text-red-500 border-t border-gray-300'>
                                    <label className='relative inline-flex items-center gap-3 text-gray-900 cursor-pointer'>
                                        <input type='checkbox' className='sr-only peer' checked={item.isAvailable} />
                                        <div className='w-12 transition-colors duration-200 rounded-full h-7 bg-slate-300 peer peer-checked:bg-blue-600'></div>
                                        <span className='absolute w-5 h-5 transition-transform duration-200 ease-in-out bg-white rounded-full dot left-1 top-1 peer-checked:translate-x-5'></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListRoom
