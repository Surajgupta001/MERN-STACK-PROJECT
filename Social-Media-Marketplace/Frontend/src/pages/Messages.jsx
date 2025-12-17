import React, { useEffect, useMemo, useState } from 'react'
import { dummyChats } from '../assets/assets';
import { MessageCircle, Search } from 'lucide-react';
import { format, parseISO, isYesterday, isToday } from 'date-fns';
import { useDispatch } from 'react-redux';
import { setChat } from '../app/features/chatSlice';

function Messages() {

  const dispatch = useDispatch();

  const user = { id: 'user_1' };

  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const formateTime = (dateString) => {
    if (!dateString) return;

    const date = parseISO(dateString);

    if (isToday(date)) {
      return 'Today ' + format(date, 'HH:mm');
    }
    if (isYesterday(date)) {
      return 'Yesterday ' + format(date, 'HH:mm');
    }

    return format(date, 'MMM d');
  };

  const filteredChats = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      const chatUser = chat.chatUserId === user?.id ? chat.ownerUser : chat.chatUser;
      return (
        chat.listing?.title.toLowerCase().includes(query) ||
        chatUser?.name.toLowerCase().includes(query) ||
        (chat.lastMessage && chat.lastMessage.toLowerCase().includes(query))
      );
    })
  }, [chats, searchQuery]);

  const handleOpenCHat = (chat) => {
    dispatch(setChat({
      listing: chat.listing,
      chatId: chat.id,
    }))
  };

  const fetchUserChats = async () => {
    setChats(dummyChats);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserChats();
    const interval = setInterval(() => {
      fetchUserChats();
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, [])

  return (
    <div className='min-h-screen px-6 mx-auto md:px-16 lg:px-24 xl:px-32'>
      <div className='py-10'>
        {/* Header */}
        <div className='mb-8 text-left'>
          <h1 className='mb-2 text-3xl font-bold text-gray-800'>Messages</h1>
          <p className='text-gray-600'>Chat with buyers and sellers</p>
        </div>
        {/* Search Bar */}
        <div className='relative max-w-xl mb-8'>
          <Search className='absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2' />
          <input type="text" placeholder='Search Conversations...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-full py-2 pl-10 pr-4 border rounded-lg border-b-gray-300 focus:outline-indigo-500' />
        </div>
        {/* Chats List */}
        {loading ? (
          <div className='py-20 text-center text-gray-500'>Loading messages...</div>
        ) : (
          filteredChats.length === 0 ? (
            <div className='p-16 text-center bg-white border border-gray-200 rounded-lg shadow-xs'>
              <div className='flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full max-auto'>
                <MessageCircle className='w-8 h-8 text-gray-400' />
                <h3 className='mb-2 text-xl font-medium text-gray-800'>{searchQuery ? 'No conversations found' : 'No messages yet'}</h3>
                <p className='text-gray-600'>
                  {searchQuery ? 'Try a different search term.' : 'conversations by viewing a listing and clicking "chat with seller"'}
                </p>
              </div>
            </div>
          ) : (
            <div className='bg-white border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-xs'>
              {filteredChats.map((chat) => {
                const chatUser = chat.chatUserId === user.id ? chat.ownerUser : chat.chatUser;
                return (
                  <button onClick={() => handleOpenCHat(chat)} key={chat.id} className='w-full p-4 text-left transition-colors hover:bg-gray-50'>
                    <div className='flex items-start space-x-4'>
                      <div className='shrink-0'>
                        <img src={chatUser?.image} alt={chat?.chatUser?.name} className='object-cover w-12 h-12 rounded-lg' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between mb-1'>
                          <h3 className='font-semibold text-gray-800 truncate'>{chat.listing?.title}</h3>
                          <span className='ml-2 text-xs text-gray-500 shrink-0'>{formateTime(chat.updatedAt)}</span>
                        </div>
                        <p className='mb-1 text-sm text-gray-600 truncate'>{chatUser?.name}</p>
                        <p className={`text-sm truncate ${!chat.isLastMessageRead && chat.lastMessageSenderId !== user?.id ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Messages
