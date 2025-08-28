import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
    return (
        <div className='flex items-center justify-between gap-4 px-4 py-3 lg:px-44'>
            <img width={150} src={assets.logo} alt="" />
            <p className='flex-1 pl-4 text-sm text-gray-500 border-gray-400 border-1 max-sm:hidden'>Copyright © 2025 | All Rights Reserved</p>
            <div className='flex gap-1'>
                <img width={40} src={assets.facebook_icon} alt="Facebook" />
                <img width={40} src={assets.twitter_icon} alt="Twitter" />
                <img width={40} src={assets.google_plus_icon} alt="Instagram" />
            </div>
        </div>
    )
}

export default Footer
