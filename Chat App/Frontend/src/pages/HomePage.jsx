import React, { useContext} from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSiderbar from '../components/RightSiderbar'
import { ChatContext } from '../../context/ChatContext'

function HomePage() {

    const { selectedUser } = useContext(ChatContext);

    return (
        <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
            <div className={`overflow-hidden border-2 border-gray-600 backdrop-blur-xl rounded-2xl h-[100%] grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
                <Sidebar />
                <ChatContainer />
                <RightSiderbar />
            </div>
        </div>
    )
}

export default HomePage
