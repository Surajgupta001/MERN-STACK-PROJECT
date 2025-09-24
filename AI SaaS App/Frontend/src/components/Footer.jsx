import React from 'react'
import { assets } from '../assets/assets';

function Footer() {
    return (
        <footer className="w-full px-6 pt-8 text-gray-500 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col justify-between w-full gap-10 pb-6 border-b md:flex-row border-gray-500/30">
                <div className="md:max-w-96">
                    <img src={assets.logo} alt="logo" />
                    <p className="mt-6 text-sm">Experince the power of AI with QuickAi. <br />Transform your content creation with our suite of premium AI tool. Write articles, generate images, and enhance your workflow.</p>
                </div>
                <div className="flex items-start flex-1 gap-20 md:justify-end">
                    <div>
                        <h2 className="mb-5 font-semibold text-gray-800">Company</h2>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-5 font-semibold text-gray-800">Subscribe to our newsletter</h2>
                        <div className="space-y-2 text-sm">
                            <p>The latest news, articles, and resources, sent to your inbox weekly.</p>
                            <div className="flex items-center gap-2 pt-4">
                                <input className="w-full px-2 placeholder-gray-500 border rounded outline-none border-gray-500/30 focus:ring-2 ring-indigo-600 max-w-64 h-9" type="email" placeholder="Enter your email" />
                                <button className="w-24 text-white rounded cursor-pointer bg-primary h-9">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 pb-5 text-xs text-center md:text-sm">Copyright 2025 © All Right Reserved.</p>
        </footer>
    );
}

export default Footer
