import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

function Uploads() {

    const { removeBg } = useContext(AppContext);
    
    return (
        <div className='pb-16'>
            <h1 className='py-16 mt-4 text-2xl font-semibold text-center text-transparent md:text-3xl lg:text-4xl bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text md:py-16'>See the magic. Try now</h1>
            <div className='mb-24 text-center'>
                <input onChange={(e) => removeBg(e.target.files[0])} type="file" accept='image/*' id='upload2' hidden />
                <label className='inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-500 m-auto hover:scale-105 transition-all duration-700' htmlFor="upload2">
                    <img src={assets.upload_btn_icon} width={20} alt="" />
                    <p className='text-sm text-white '>Upload your image</p>
                </label>
            </div>
        </div>
    )
}

export default Uploads
