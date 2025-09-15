import React, { useState } from 'react'
import { assets, dummyUserData, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';

function Sidebar() {

    const user = dummyUserData;
    const location = useLocation();
    const [image, setImage] = useState('');

    const updateImage = async () => {
        user.image = URL.createObjectURL(image);
        setImage('');
    };

    return (
        <div className='relative flex-col items-center w-full min-h-screen pt-8 text-sm border-r md:flex max-w-13 md:max-w-60 border-borderColor'>
            <div className='relative group'>
                <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image) : user?.image || 'https://unsplash.com/photos/dramatic-sunset-sky-over-silhouetted-burnt-forest-landscape-4dIIaCdfAKc'} alt="" className='mx-auto rounded-full h-9 md:h-14 w-9 md:w-14' />
                    <input type="file" id="image" accept='image/*' onChange={(e) => setImage(e.target.files[0])} hidden />
                    <div className='absolute top-0 bottom-0 left-0 right-0 items-center justify-center hidden rounded-full cursor-pointer bg-black/10 group-hover:flex'>
                        <img src={assets.edit_icon} alt="" />
                    </div>
                </label>
            </div>
            {image && (<button onClick={updateImage} className='absolute top-0 right-0 flex gap-1 p-2 cursor-pointer bg-primary/10 text-primary'><img src={assets.check_icon} width={13} alt="" />Save</button>)}
            <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>
            <div className='w-full'>
                {ownerMenuLinks.map((link, index) => (
                    <NavLink key={index} to={link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6${link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray-600'}`}>
                        <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="car icon" />
                        <span className='max-md:hidden'>{link.name}</span>
                        <div className={`${link.path === location.pathname && 'bg-primary'} w-1.5 h-8 rounded-l right-0 absolute`}></div>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
