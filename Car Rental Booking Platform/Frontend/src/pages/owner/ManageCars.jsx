import React, { useEffect, useState } from 'react'
import { assets, dummyCarData } from '../../assets/assets';
import Title from '../../components/owner/Title';

function ManageCars() {

  const currency = import.meta.env.VITE_CURRENCY;
  const [cars, setCars] = useState([]);

  const fetchOwnerCars = async () => {
    setCars(dummyCarData);
  };

  useEffect(() => {
    fetchOwnerCars();
  }, []);

  return (
    <div className='w-full px-4 pt-10 md:px-10'>
      <Title title='manage cars' subtitle='View all listed cars, update their details, or remove them from the booking platform.' />
      <div className='w-full max-w-3xl mt-6 overflow-hidden border rounded-md border-borderColor'>
        <table className='w-full text-sm text-left text-gray-600 border-collapse'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className='border-t border-borderColor'>
                <td className='flex items-center gap-2 p-3'>
                  <img src={car.image} alt="" className='object-cover w-12 h-12 rounded-md aspect-square' />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{car.brand} {car.model}</p>
                    <p className='text-xs text-gray-500'>{car.seating_capacity} • {car.transmission}</p>
                  </div>
                </td>
                <td className='p-3 max-md:hidden'>{car.category}</td>
                <td className='p-3'>{currency} {car.pricePerDay}/day</td>
                <td className='p-3 max-md:hidden'>
                  <span className={` px-3 py-1 rounded-full text-xs ${car.isAvaliable ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`}>{car.isAvaliable ? 'Available' : 'Unavailable'}</span>
                </td>
                <td className='flex items-center p-3'>
                  <img src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer' />
                  <img src={assets.delete_icon} alt="" className='cursor-pointer' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageCars
