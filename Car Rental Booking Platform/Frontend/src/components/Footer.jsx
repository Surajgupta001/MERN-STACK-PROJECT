import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
    return (
        <div className='px-6 text-sm text-gray-500 md:px-16 lg:px-24 xl:px-32 mt-60'>
            <div className='flex flex-wrap justify-between gap-8 pb-6 border-b border-borderColor'>
                <div>
                    <img src={assets.logo} alt="logo" className='h-8 md:h-9' />
                    <p className='mt-3 max-w-80'>
                        Premium car rental service offering a wide range of luxury vehicles for all your travel needs.
                    </p>
                    <div className='flex items-center gap-3 mt-6'>
                        <a href="#"><img src={assets.facebook_logo} alt="" className='w-5 h-5' /></a>
                        <a href="#"><img src={assets.instagram_logo} alt="" className='w-5 h-5' /></a>
                        <a href="#"><img src={assets.twitter_logo} alt="" className='w-5 h-5' /></a>
                        <a href="#"><img src={assets.gmail_logo} alt="" className='w-5 h-5' /></a>
                    </div>
                </div>
                <div>
                    <p className='text-base font-medium text-gray-800 uppercase'>Quick Links</p>
                    <ul className='flex flex-col gap-1.5 mt-3'>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Browse Cars</a></li>
                        <li><a href="#">List Your Car</a></li>
                        <li><a href="#">About Us</a></li>
                    </ul>
                </div>
                <div>
                    <p className='text-base font-medium text-gray-800 uppercase'>Resources</p>
                    <ul className='flex flex-col gap-1.5 mt-3'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>
                <div>
                    <p className='text-base font-medium text-gray-800 uppercase'>Contacts</p>
                    <ul className='flex flex-col gap-1.5 mt-3'>
                        <li>1234 Luxury Drive</li>
                        <li>San Francisco, CA 94101</li>
                        <li>(123) 456-7890</li>
                        <li>info@luxurycarrental.com</li>
                    </ul>
                </div>
            </div>
            <div className='flex flex-col items-center justify-between gap-2 py-5 md:flex-row'>
                <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li>|</li>
                    <li><a href="#">Terms</a></li>
                    <li>|</li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Footer
