import React from 'react'
import Navbar from '../../components/educator/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

function Educator() {
  return (
    <div className='min-h-screen bg-white text-default'>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1'>
          {<Outlet />}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Educator
