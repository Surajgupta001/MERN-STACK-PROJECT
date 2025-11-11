import React from 'react'
import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react'

function PersonalInfoForm({ data, onChange, removeBackground, setRemoveBackground }) {

    const handleChange = (field, value) => {
        onChange({
            ...data,
            [field]: value
        })
    };

    const fields = [
        {
            key: 'full_name',
            label: 'Full Name',
            icon: User,
            type: 'text',
            required: true
        },
        {
            key: 'email',
            label: 'Email Address',
            icon: Mail,
            type: 'email',
            required: true
        },
        {
            key: 'phone',
            label: 'Phone Number',
            icon: Phone,
            type: 'tel'
        },
        {
            key: 'location',
            label: 'Location',
            icon: MapPin,
            type: 'text'
        },
        {
            key: 'profession',
            label: 'Profession',
            icon: BriefcaseBusiness,
            type: 'text'
        },
        {
            key: 'linkedin',
            label: 'LinkedIn Profile',
            icon: Linkedin,
            type: 'url'
        },
        {
            key: 'website',
            label: 'Personal Website',
            icon: Globe,
            type: 'url'
        }
    ];

    return (
        <div>
            <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
            <p className='text-sm text-gray-600'>Get Started with the personal information</p>
            <div className='flex items-center gap-2'>
                <label>
                    {data.image ? (
                        <img src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)} alt="user-image" className='object-cover w-16 h-16 mt-5 rounded-full ring ring-slate-300 hover:opacity-80' />
                    ) : (
                        <div className='inline-flex items-center gap-2 mt-5 cursor-pointer text-slate-600 hover:text-slate-700'>
                            <User className='w-10 h-10 p-2.5 border rounded-full' />
                            upload user image
                        </div>
                    )}
                    <input onChange={(e) => handleChange('image', e.target.files[0])} type="file" accept='image/jpeg, image/png' className='hidden' />
                </label>
                {typeof data.image === 'object' && (
                    <div className='flex flex-col gap-1 pl-4 text-sm'>
                        <p>Remove background</p>
                        <label className='relative inline-flex items-center gap-3 text-gray-900 cursor-pointer'>
                            <input onChange={() => setRemoveBackground(prev => !prev)} checked={removeBackground} type="checkbox" className='sr-only peer' />
                            <div className='h-5 transition-colors duration-200 rounded-full w-9 bg-slate-300 peer-checked:bg-green-600'></div>
                            <span className='absolute w-3 h-3 transition-transform duration-300 ease-in-out transform bg-white rounded-full shadow left-1 top-1 peer-checked:translate-x-4'></span>
                        </label>
                    </div>
                )}
            </div>
            {fields.map((field) => {
                const Icon = field.icon;
                return (
                    <div key={field.key} className='mt-5 space-y-1'>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                            <Icon className='w-4 h-4' />
                            {field.label}
                            {field.required && <span className='text-red-500'>*</span>}
                        </label>
                        <input onChange={(e) => handleChange(field.key, e.target.value)} type={field.type} value={data[field.key] || ''} className='w-full px-3 py-2 mt-1 text-sm transition border border-gray-300 rounded-lg outline-none focus:ring focus:ring-blue-500 focus:border-blue-500' placeholder={field.label.toLowerCase()} required={field.required}/>
                    </div>
                )
            })}
        </div>
    )
}

export default PersonalInfoForm
