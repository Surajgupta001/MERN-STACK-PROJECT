import React, { useEffect, useState } from 'react'
import { dummyRecentMessagesData } from '../assets/assets';
import { Link } from 'react-router-dom';
import moment from 'moment';

function RecentMessages() {

    const [messages, setMessages] = useState([]);

    const fetchRecentMessages = async () => {
        setMessages(dummyRecentMessagesData);
    };

    useEffect(() => {
        fetchRecentMessages();
    }, []);

    return (
        <div className='max-w-xs p-4 mt-4 text-xs bg-white rounded-md shadow min-h-20 text-slate-800'>
            <h3 className='mb-4 font-semibold text-slate-800'>Recent Messages</h3>
            <div className='flex flex-col overflow-y-scroll max-h-56 no-scrollbar'>
                {messages.map((message, index) => (
                    <Link to={`/messages/${message.from_user_id._id}`} key={index} className='flex items-start gap-2 py-2 hover:bg-slate-100'>
                        <img src={message.from_user_id.profile_picture} alt="" className='w-8 h-8 rounded-full' />
                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <p className='font-semibold'>{message.from_user_id.full_name}</p>
                                <p className='text-[10px] text-slate-400'>{moment(message.createdAt).fromNow()}</p>
                            </div>
                            <div className='flex justify-between'>
                                <p className='text-gray-500'>{message.text ? message.text : 'media'}</p>
                                {!message.seen && <p className='flex items-center justify-center w-4 h-4 text-white bg-indigo-500 rounded-full text-[10px]'>1</p>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default RecentMessages
