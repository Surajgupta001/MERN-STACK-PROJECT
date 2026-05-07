import React from 'react'
import LoginLeftSide from '../components/LoginLeftSide'
import { ArrowRightIcon, ShieldIcon, UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

function LoginLanding() {

  const portalOptions = [
    {
      to: '/login/admin',
      title: 'Admin Portal',
      description: 'Manage employees, departments, payroll, and system configurations.',
      icon: ShieldIcon
    },
    {
      to: '/login/employee',
      title: 'Employee Portal',
      description: 'View your profile, track attendance, and access payslips securely.',
      icon: UserIcon
    },
  ]
  return (
    <div className='flex flex-col min-h-screen md:flex-row'>
      <LoginLeftSide />
      <div className='relative flex flex-col items-center justify-center w-full min-h-screen p-6 overflow-y-auto md:w-1/2 sm:p-12 lg:p-16'>
        <div className='relative z-10 w-full max-w-md animate-fade-in'>
          {/* Header */}
          <div className='mb-10 text-center md:text-left'>
            <h2 className='mb-3 text-3xl font-medium tracking-tight text-slate-900'>Welcome Back</h2>
            <p className='text-slate-500'>Select your portal to securely access the system</p>
          </div>
          {/* Portal List */}
          <div className='space-y-4'>
            {portalOptions.map((portal) => (
              <Link key={portal.to} to={portal.to} className='flex items-center p-4 transition-colors border rounded-lg group border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'>
                <div className='relative z-10 flex items-center justify-between w-full gap-4 sm:gap-5'>
                  <h3 className='mb-1 text-lg transition-colors text-slate-800 group-hover:text-indigo-600!'>{portal.title}</h3>
                  <ArrowRightIcon className='w-4 h-4 transition-all duration-300 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1' />
                </div>
              </Link>
            ))}
          </div>
          {/* Footer */}
          <div className='mt-12 text-center md:text-left text=sm text-slate-400'>
            <p>@ {new Date(). getFullYear()} GreatStack. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginLanding