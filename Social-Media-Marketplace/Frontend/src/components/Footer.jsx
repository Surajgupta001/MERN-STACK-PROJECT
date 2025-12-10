import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
    return (
        <>
            <footer className="w-full px-6 pt-10 mt-32 text-sm bg-white md:px-16 lg:px-24 xl:px-32 text-slate-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <a href='/'>
                            <img src={assets.logo} alt="logo" />
                        </a>
                        <p className="mt-6 text-sm/7">Flipearn is a social media marketplace . We are the leading social media marketplace that connects brands with their customers with our user-friendly interface.</p>
                    </div>
                    <div className="flex flex-col lg:items-center lg:justify-center">
                        <div className="flex flex-col text-sm space-y-2.5">
                            <h2 className="mb-5 font-semibold text-gray-800">Company</h2>
                            <a className="transition hover:text-slate-600" href="#">About us</a>
                            <a className="transition hover:text-slate-600" href="#">Careers<span className="px-2 py-1 ml-2 text-xs text-white bg-indigo-600 rounded-md">We’re hiring!</span></a>
                            <a className="transition hover:text-slate-600" href="#">Contact us</a>
                            <a className="transition hover:text-slate-600" href="#">Privacy policy</a>
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-5 font-semibold text-gray-800">Subscribe to our newsletter</h2>
                        <div className="max-w-sm space-y-6 text-sm">
                            <p>The latest news, articles, and resources, sent to your inbox weekly.</p>
                            <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-indigo-50">
                                <input className="w-full px-2 py-2 bg-white rounded outline-none focus:ring-2 ring-indigo-600 max-w-64" type="email" placeholder="Enter your email" />
                                <button className="px-4 py-2 text-white bg-indigo-600 rounded">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="py-4 mt-6 text-center border-t border-slate-200">
                    Copyright 2025 © flipearn All Rights Reserved.
                </p>
            </footer>
        </>
    )
}

export default Footer
