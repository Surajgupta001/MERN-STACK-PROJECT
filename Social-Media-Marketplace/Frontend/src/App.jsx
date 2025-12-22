import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import MyListing from './pages/MyListing'
import ListingDetails from './pages/ListingDetails'
import ManageListing from './pages/ManageListing'
import Messages from './pages/Messages'
import MyOrders from './pages/MyOrders'
import Loading from './pages/Loading'
import Navbar from './components/Navbar'
import Chatbox from './components/Chatbox'
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'

function App() {

  const { pathname } = useLocation();
  const { isOpen } = useSelector((state) => state.chat);

  return (
    <div>
      <Toaster />
      {(!pathname.includes('/admin') && !isOpen) && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/marketplace' element={<Marketplace />} />
        <Route path='/my-listings' element={<MyListing />} />
        <Route path='/listing/:listingId' element={<ListingDetails />} />
        <Route path='/create-listing' element={<ManageListing />} />
        <Route path='/edit-listing/:id' element={<ManageListing />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/my-orders' element={<MyOrders />} />
        <Route path='/loading' element={<Loading />} />
        <Route />
      </Routes>
      <Chatbox />
    </div>
  )
}

export default App
