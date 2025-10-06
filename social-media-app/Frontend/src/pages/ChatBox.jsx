import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { ImageIcon, SendHorizonal } from 'lucide-react';

function ChatBox() {

  const messages = dummyMessagesData;

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(dummyUserData);

  const messageEndRef = useRef(null);

  const sendMessage = async () => {

  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages]);

  return user && (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-2 p-2 border-b border-gray-300 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50'>
        <img src={user.profile_picture} alt="" className='rounded-full size-8' />
        <div>
          <p className='font-medium'>{user.full_name}</p>
          <p className='text-sm text-gray-500 -mt-1.5'>@{user.username}</p>
        </div>
      </div>
      <div className='h-full p-5 overflow-y-scroll md:px-10'>
        <div className='max-w-4xl mx-auto space-y-4'>
          {messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
            <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
              <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                {message.message_type === 'image' && (
                  <img src={message.media_url} alt="" className='w-full max-w-sm mb-1 rounded-lg' />
                )}
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </div>
      <div className='px-4'>
        <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
          <input onChange={(e) => setText(e.target.value)} value={text} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} type="text" placeholder='Type your message here...' className='flex-1 outline-none text-slate-700' />
          <label htmlFor="images">
            {image ? <img src={URL.createObjectURL(image)} className='h-8 rounded' alt="" /> : <ImageIcon className='text-gray-400 cursor-pointer size-7' />}
            <input type="file" id="images" accept="image/*" onChange={(e) => setImage(e.target.files[0])} hidden />
          </label>
          <button onClick={sendMessage} className='p-2 text-white rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-pink-800 active:scale-95'>
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
