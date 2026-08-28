import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ProtectedLayout() {
    return (
        <div className="flex flex-col h-screen overflow-y-scroll font-sans bg-slate-50 text-slate-900 bg-[url('/layout_bg.png')] bg-cover bg-center bg-no-repeat">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}
