import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Loader2Icon, Send, X } from 'lucide-react';
import { clearChat } from '../app/features/chatSlice';
import { format } from 'date-fns';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../config/axios';
import toast from 'react-hot-toast';

function Chatbox() {

    const { listing, isOpen, chatId } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const { getToken } = useAuth();
    const { user } = useUser();
    
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    // Safely format message timestamps to avoid RangeError on invalid dates
    const formatTime = (value) => {
        if (!value) return '';
        const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
        if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '';
        return format(d, "MMM dd 'at' h:mm a");
    };

    const fetchChat = async () => {
        try {
            const token = await getToken();
            const { data } = await api.post('/api/chat', {
                listingId: listing.id,
                chatId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setChat(data?.chat);
            setMessages(data?.chat?.messages || []);
            setIsLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (listing) {
            fetchChat();
            const interval = setInterval(() => {
                fetchChat();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [listing]);

    useEffect(() => {
        if (!isOpen) {
            setChat(null);
            setMessages([]);
            setNewMessage('');
            setIsLoading(true);
            setIsSending(false);
        }
    }, [isOpen]);

    // For Auto Scroll
    const messageEndRef = useRef(null);
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;
        try {
            setIsSending(true);
            const token = await getToken();
            const { data } = await api.post('/api/chat/send-message', {
                chatId: chat.id,
                message: newMessage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMessages([...messages, data.messageObject]);
            setNewMessage('');
            setIsSending(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-black/70 backdrop-blur sm:p-4'>
            <div className='flex flex-col w-full h-screen max-w-2xl overflow-hidden bg-white shadow-2xl sm:rounded-lg sm:h-[600px]'>
                {/* Header */}
                <div className='flex items-center justify-between p-4 text-white bg-linear-to-r from-indigo-600 to-indigo-400 sm:rounded-t-lg'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-semibold text-left truncate'>{listing.title}</h3>
                        <p className='text-sm text-left text-indigo-100 truncate'>
                            {user.id === listing?.ownerId
                                ? `chatting with buyers (${chat?.chatUser?.name || 'Loading....'})`
                                : `chatting with seller (${chat?.ownerUser?.name || 'Loading....'})`}
                        </p>
                    </div>
                    <button onClick={() => dispatch(clearChat())} className='ml-4 transition-colors rounded-lg hover:bg-white/20 hover:bg-opacity-20'>
                        <X className='w-5 h-5' />
                    </button>
                </div>
                {/* Messages Area */}
                <div className='flex-1 p-4 space-y-4 overflow-y-auto bg-gray-100'>
                    {isLoading ? (
                        <div className='flex items-center justify-center h-full'>
                            <Loader2Icon className='text-indigo-600 size-6 animate-spin' />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className='flex items-center justify-center h-full'>
                            <div className='text-center'>
                                <p className='mb-2 text-gray-500'>No messages yet</p>
                                <p className='text-sm text-gray-400'>Start the conversation!</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div key={message.id ?? `${message.sender_id}-${message.createdAt ?? index}-${index}`} className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-lg pb-1 ${message.sender_id === user.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                                    <p className='text-sm whitespace-pre-wrap wrap-break-word'>{message.message}</p>
                                    <p className={`text-[10px] mt-1 text-left ${message.sender_id === user.id ? 'text-indigo-200' : 'text-gray-400'}`}>{formatTime(message.createdAt)}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messageEndRef} />
                </div>
                {/* Input Area */}
                {chat?.listing?.status === 'active' ? (
                    <form onSubmit={handleSendMessage} className='p-4 bg-white border-t border-gray-200 rounded-b-lg'>
                        <div className='flex items-end space-x-2'>
                            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder='Type your message...' className='flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-indigo-500 max-h-32' rows={1} />
                            <button disabled={!newMessage.trim() || isSending} type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg disabled:opacity-50 transition-colors'>
                                {isSending ? (
                                    <Loader2Icon className='w-5 h-5 animate-spin' />
                                ) : (
                                    <Send className='w-5 h-5' />
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className='p-4 bg-white border-t border-gray-200 rounded-b-lg'>
                        <p className='text-sm text-center text-gray-600'>{chat ? `Listing is ${chat?.listing?.status}` : 'Loading chat...'}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chatbox
