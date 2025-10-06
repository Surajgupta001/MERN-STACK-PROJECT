import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets';
import { Image, X } from 'lucide-react';
import toast from 'react-hot-toast';

function CreatePost() {

  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = dummyUserData;

  const handleSubmit = async () => {

  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl p-6 mx-auto'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-slate-900'>Create Post</h1>
          <p className='text-slate-600'>Share your thoughts with the world!</p>
        </div>
        {/* Form */}
        <div className='max-w-xl p-4 space-y-4 bg-white shadow-md sm:p-8 sm:pb-3 rounded-xl'>
          {/* Header */}
          <div className='flex items-center gap-3'>
            <img src={user.profile_picture} alt="" className='w-12 h-12 rounded-full shadow' />
            <div>
              <h2 className='font-semibold'>{user.full_name}</h2>
              <p className='text-sm text-gray-500'>@{user.username}</p>
            </div>
          </div>
          {/* Text Area */}
          <textarea onChange={(e) => setContent(e.target.value)} value={content} placeholder="What's on your mind?" className='w-full mt-4 text-sm placeholder-gray-400 outline-none resize-none max-h-20' />
          {/* Images */}
          {
            images.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-4'>
                {images.map((image, index) => (
                  <div key={index} className='relative group'>
                    <img src={URL.createObjectURL(image)} alt="" className='h-20 rounded-md' />
                    <div onClick={() => setImages(images.filter((_, i) => index !== i))} className='absolute top-0 bottom-0 left-0 right-0 items-center justify-center hidden rounded-md cursor-pointer group-hover:flex bg-black/40'>
                      <X className='w-6 h-6 text-white' />
                    </div>
                  </div>
                ))}
              </div>
            )
          }
          {/* Bottom Bar */}
          <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
            <label htmlFor="images" className='flex items-center gap-2 text-gray-500 transition cursor-pointer tex-sm hover:text-gray-700'>
              <Image className='size-6' />
            </label>
            <input type="file" id="images" accept="image/*" multiple onChange={(e) => setImages([...images, ...Array.from(e.target.files)])} hidden />
            <button disabled={loading} onClick={() => toast.promise(
              handleSubmit(),
              {
                loading: 'loading...',
                success: <p>Post Published</p>,
                error: <p>Post Not Published</p>
              }
            )} className='px-8 py-2 font-medium text-white transition rounded-md cursor-pointer texts-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95'>Publish Post</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
