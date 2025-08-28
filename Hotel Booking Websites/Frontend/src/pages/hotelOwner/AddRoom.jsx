import React, { useState } from 'react'
import Title from '../../components/Title';
import { assets } from '../../assets/assets';

function AddRoom() {

    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
    });

    const [inputs, setInputs] = useState({
        roomType: '',
        pricePerNight: 0,
        amenities: {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
        }
    });

    return (
        <form>
            <Title align='left' font='outfit' title='Add Room' subtitle='Fill in the details carefully and accurate room details, pricing and amenities, to the enhance the user booking experience.' />
            {/* Upload Area for images */}
            <div className='grid flex-wrap grid-cols-2 gap-4 my-2 sm:flex'>
                {Object.keys(images).map((key) => (
                    <label htmlFor={`roomImage${key}`} key={key}>
                        <img src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" className='cursor-pointer max-h-13 opacity-80' />
                        <input onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })} type='file' accept='image/*' id={`roomImage${key}`} hidden />
                    </label>
                ))}
            </div>
            <div className='flex w-full mt-4 max-sm:flex-col sm:gap-4'>
                <div className='flex-1 max-w-48'>
                    <p className='mt-4 text-gray-800'>Room Type</p>
                    <select onClick={(e) => setInputs({ ...inputs, roomType: e.target.value })} value={inputs.roomType} className='w-full p-2 mt-1 border border-gray-300 rounded opacity-70'>
                        <option value="">Select Room Type</option>
                        <option value="Single Bed">Single Bed</option>
                        <option value="Luxury Room">Luxury Room</option>
                        <option value="Family Suite">Family Suite</option>
                    </select>
                </div>
                <div>
                    <p className='mt-4 text-gray-800'>Price <span className='text-xs'>/night</span></p>
                    <input type='number' placeholder='0' className='w-24 p-2 mt-1 border border-gray-300 rounded' value={inputs.pricePerNight} onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })} />
                </div>
            </div>
            <p className='mt-4 text-gray-800'>Amenities</p>
            <div className='flex flex-col flex-wrap max-w-sm mt-1 text-gray-400'>
                {Object.keys(inputs.amenities).map((amenity, index) => (
                    <div key={index} className='flex items-center'>
                        <input type='checkbox' id={`amenity-${index + 1}`} checked={inputs.amenities[amenity]} onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })} className='mr-2' />
                        <label htmlFor={`amenity-${index + 1}`}> {amenity}</label>
                    </div>
                ))}
            </div>
            <button className='px-8 py-2 mt-8 text-white rounded bg-primary'>Add Room</button>
        </form>
    )
}

export default AddRoom
