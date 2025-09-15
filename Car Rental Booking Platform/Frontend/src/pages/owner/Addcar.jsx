import React, { useState } from 'react'
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';

function Addcar() {

  const currency = import.meta.env.VITE_CURRENCY;

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: ''
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // Handle form submission logic here

  };

  return (
    <div className='flex-1 px-4 py-10 md:px-10'>
      <Title title='Add New Car' subtitle='Fill the details to list a new car for booking, including pricing, availability, and car specifications.' />
      <form onSubmit={onSubmitHandler} className='flex flex-col max-w-xl gap-5 mt-6 text-sm text-gray-500'>
        {/* Car Image */}
        <div className='flex items-center w-full gap-2'>
          <label htmlFor="car_image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='rounded cursor-pointer h-14' />
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="car_image" accept='image/*' hidden />
          </label>
          <p className='text-sm text-gray-500'>Upload Car Image</p>
        </div>
        {/* Car Brands & Models */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input type="text" placeholder='e.g. BMW, Mercedes, Audi...' value={car.brand} onChange={(e) => setCar({ ...car, brand: e.target.value })} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor' required />
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input type="text" placeholder='e.g. 320i, A4, Q5...' value={car.model} onChange={(e) => setCar({ ...car, model: e.target.value })} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor' required />
          </div>
        </div>
        {/* Car Year, Price, Category */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 sm:grid-cols-2'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <input type="number" placeholder='e.g. 2020, 2021, 2022...' value={car.year} onChange={(e) => setCar({ ...car, year: e.target.value })} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor' required />
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input type="number" placeholder='e.g. 50, 100, 150...' value={car.pricePerDay} onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor' required />
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select onChange={(e) => setCar({ ...car, category: e.target.value })} value={car.category} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor'>
              <option value="">Select Category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
            </select>
          </div>
        </div>
        {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select onChange={(e) => setCar({ ...car, transmission: e.target.value })} value={car.transmission} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor'>
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-automatic">Semi-automatic</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select onChange={(e) => setCar({ ...car, fuel_type: e.target.value })} value={car.fuel_type} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor'>
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input type="number" placeholder='e.g. 4, 5, 6...' value={car.seating_capacity} onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor' required />
          </div>
        </div>
        {/* Car Location */}
        <div className='flex flex-col w-full'>
          <label>Location</label>
          <select onChange={(e) => setCar({ ...car, location: e.target.value })} value={car.location} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor'>
            <option value="">Select Location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Houston">Houston</option>
            <option value="Chicago">Chicago</option>
            <option value="Miami">Miami</option>
          </select>
        </div>
        {/* Car Description */}
        <div className='flex flex-col w-full'>
          <label>Descriptions</label>
          <textarea placeholder='e.g. Spacious and comfortable' value={car.description} rows={5} onChange={(e) => setCar({ ...car, description: e.target.value })} className='px-3 py-2 mt-1 border rounded-md outline-none border-borderColor' required></textarea>
        </div>
        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          List Your Car
        </button>
      </form>
    </div>
  )
}

export default Addcar
