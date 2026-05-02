import React, { useEffect, useState } from 'react'
import { Lock } from 'lucide-react';
import { dummyProfileData } from '../assets/assets';
import Loading from '../components/Loading';
import ProfileForm from '../components/ProfileForm';
import ChangePasswordModal from '../components/ChangePasswordModal';

function Settings() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    setProfile(dummyProfileData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loading />

  return (
    <div className='animate-fade-in'>
      <div className='page-header'>
        <h1 className='page-title'>Settings</h1>
        <p className='page-subtitle'>Manage your account settings and preferences.</p>
      </div>
      {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile} />}
      {/* Change Password Trigger */}
      <div className='flex items-center justify-between max-w-md p-6 card'>
        <div className='flex items-center gap-3'>
          <div className='p-2.5 bg-slate-100 rounded-lg'>
            <Lock className='w-5 h-5 text-slate-600' />
          </div>
          <div>
            <p className='font-medium text-slate-900'>Password</p>
            <p className='text-sm text-slate-500'>Update your account password at any time.</p>
          </div>
        </div>
        <button onClick={() => setShowPasswordModal(true)} className='text-sm btn-secondary'>Change</button>
      </div>
      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  )
}

export default Settings