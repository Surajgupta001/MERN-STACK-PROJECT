import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function ManageCars() {

  const { isOwner, axios, currency } = useAppContext();

  const [cars, setCars] = useState([]);

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owners/cars');
      if(data.success){
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Failed to fetch cars");
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      
      const { data } = await axios.post('/api/owners/toggle-car', { carId });
      
      if(data.success){
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Failed to fetch cars");
    }
  };
  
  const deleteCar = async (carId) => {
    try {
      
      const confirm = window.confirm("Are you sure you want to delete this car?");
      if(!confirm) return null;
      
      const { data } = await axios.post('/api/owners/delete-car', { carId });
      
      if(data.success){
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Failed to fetch cars");
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

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
                  <span className={` px-3 py-1 rounded-full text-xs ${car.isAvailable ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`}>{car.isAvailable ? 'Available' : 'Unavailable'}</span>
                </td>
                <td className='flex items-center p-3'>
                  <img onClick={() => toggleAvailability(car._id)} src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer' />
                  <img onClick={() => deleteCar(car._id)} src={assets.delete_icon} alt="" className='cursor-pointer' />
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
