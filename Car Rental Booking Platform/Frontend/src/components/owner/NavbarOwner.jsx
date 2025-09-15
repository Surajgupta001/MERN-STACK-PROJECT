import React from 'react'
import { assets, dummyUserData } from '../../assets/assets'
import { Link } from 'react-router-dom';

function NavbarOwner() {

  const user = dummyUserData;

  return (
    <div className='relative flex items-center justify-between px-6 py-4 text-gray-500 transition-all border-b md:px-10 border-borderColor'>
      <Link to='/'>
        <img src={assets.logo} alt="" className='h-7' />
      </Link>
      <p>Welcome, {user.name || 'Owner'}</p>
    </div>
  )
}

export default NavbarOwner
