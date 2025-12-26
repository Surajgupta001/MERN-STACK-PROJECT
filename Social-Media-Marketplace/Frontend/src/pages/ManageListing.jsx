import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { Loader2Icon, Upload } from 'lucide-react';

function ManageListing() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { userListings } = useSelector((state) => state.listing)

  const [loadingListing, setLoadingListing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    username: '',
    followers_count: '',
    engagment_rate: '',
    monthly_views: '',
    niche: '',
    price: '',
    description: '',
    verified: false,
    mentized: false,
    country: '',
    age_range: '',
    images: [],
  });

  const platforms = ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'YouTube', 'LinkedIn', 'Pinterest', 'Snapchat', 'twitch', 'discord'];

  const niches = ['lifestyle', 'fitness', 'food', 'fashion', 'beauty', 'business', 'education', 'finance', 'sports', 'health', 'other', 'travel', 'tech', 'gaming', 'entertainment', 'music', 'art'];

  const ageRange = ['13-17 years', '18-24 years', '25-34 years', '35-44 years', '45-54 years', '55-64 years', '65+ years', 'Mixed age'];

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (files.length + formData.images.length > 5) {
      return toast.error('You can upload a maximum of 5 images.');
    }
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  // Get listing data for edit if `id` is provided (edit mode)
  useEffect(() => {
    if (!id) return;
    setIsEditing(true);
    setLoadingListing(true);
    const listing = userListings.find((listing) => listing.id === id);
    if (listing) {
      setFormData(listing);
      setLoadingListing(false);
    } else {
      toast.error('Listing not found');
      navigate('/my-listings');
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  if (loadingListing) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2Icon className='text-indigo-600 size-7 animate-spin' />
      </div>
    )
  }

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-4xl px-4 mx-auto sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-left text-gray-800'>
            {isEditing ? 'Edit Listing' : 'List Your Account'}
          </h1>
          <p className='mt-2 text-left text-gray-600'>
            {isEditing ? 'Update your existing listing account listing' : 'Create a mock listing to display your account info'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* basic form */}
          <Section title='Basic Information'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <InputField label="Listing Title *" value={formData.title} placeholder='e.g., Premium Travel Instagram Account' onChange={(value) => handleInputChange('title', value)} required={true} />
              <SelectField label="Platform *" options={platforms} value={formData.platform} onChange={(value) => handleInputChange('platform', value)} required={true} />
              <InputField label="Username/Handle *" value={formData.username} placeholder='e.g., @username' onChange={(value) => handleInputChange('username', value)} required={true} />
              <SelectField label="Niche *" options={niches} value={formData.niche} onChange={(value) => handleInputChange('niche', value)} required={true} />
            </div>
          </Section>
          {/* Metrics */}
          <Section title='Account Metrics'>
            <div className='grid grid-cols-1 gap-6 mb-6 md:grid-cols-3'>
              <InputField label="Followers Count *" value={formData.followers_count} placeholder='e.g., 10000' onChange={(value) => handleInputChange('followers_count', value)} required={true} type="number" min={0} />
              <InputField label="Engagement Rate (%) *" value={formData.engagment_rate} placeholder='e.g., 5.5' onChange={(value) => handleInputChange('engagment_rate', value)} required={true} type="number" min={0} max={100} step="0.01" />
              <InputField label="Monthly Views *" value={formData.monthly_views} placeholder='e.g., 50000' onChange={(value) => handleInputChange('monthly_views', value)} required={true} type="number" min={0} />
            </div>
            <div className='grid grid-cols-1 gap-6 mb-6 md:grid-cols-2'>
              <InputField label="Primary Audience Country *" value={formData.country} placeholder='e.g., United States' onChange={(value) => handleInputChange('country', value)} />
              <SelectField label="Audience Age Group *" options={ageRange} value={formData.age_range} onChange={(value) => handleInputChange('age_range', value)} required={true} />
            </div>
            <div className='space-y-3'>
              <CheckboxField label="Account is verified on the platform" checked={formData.verified} onChange={(value) => handleInputChange('verified', value)} />
              <CheckboxField label="Account is monetized" checked={formData.mentized} onChange={(value) => handleInputChange('mentized', value)} />
            </div>
          </Section>
          {/* pricing */}
          <Section title='Pricing & Description'>
            <InputField label="Asking Price (USD) *" value={formData.price} placeholder='e.g., 100' onChange={(value) => handleInputChange('price', value)} required={true} type="number" min={0} />
            <TextAreaField label="Description *" value={formData.description} onChange={(value) => handleInputChange('description', value)} required={true} />
          </Section>
          {/* Images */}
          <Section title='Screenshots & Proof Images'>
            <div className='p-6 text-center border-2 border-gray-300 border-dashed rounded-lg'>
              <input type="file" id='images' multiple accept='image/*' onChange={handleImageUpload} className='hidden' />
              <Upload className='w-12 h-12 mx-auto mb-4 text-gray-400' />
              <label htmlFor="images" className='px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'>Upload Images</label>
              <p className='mt-2 text-sm text-gray-500'>Upload screenshots or proof images to verify your listing.</p>
            </div>
            {formData.images.length > 0 && (
              <div className='grid grid-cols-2 gap-4 mt-4 md:grid-cols-4'>
                {formData.images.map((img, index) => (
                  <div key={index} className='relative'>
                    <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt={`images ${index + 1}`} className='object-cover w-full h-24 rounded-lg' />
                    <button className='absolute text-white bg-red-600 rounded-full -top-2 -right-2 size-6 hover:bg-red-700' type='button' onClick={() => removeImage(index)}>X</button>
                  </div>
                ))}
              </div>
            )}
          </Section>
          <div className='flex justify-end gap-3 text-sm'>
            <button onClick={() => navigate(-1)} type='button' className='px-6 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50'>Cancel</button>
            <button type='submit' className='px-6 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700'>{isEditing ? 'Update Listing' : 'Create Listing'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* Common Elements */
function Section({ title, children }) {
  return (
    <div className='p-6 space-y-6 bg-white border border-gray-200 rounded-lg'>
      <h2 className='text-lg font-semibold text-left text-gray-800'>{title}</h2>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', required = false, min = null, max = null }) {
  return (
    <div>
      <label className='block mb-2 text-sm font-medium text-left text-gray-700'>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} min={min} max={max} className='w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300' />
    </div>
  )
}

function SelectField({ label, options, value, onChange, required = false }) {
  return (
    <div>
      <label className='block mb-2 text-sm font-medium text-left text-gray-700'>{label}</label>
      <select className='w-full px-3 py-1.5 text-gray-600 border rounded-md focus-outline-none focus:ring-2 focus:ring-indigo-500 border-r-gray-300' required={required} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value=''>Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

function CheckboxField({ label, checked, onChange, required = false }) {
  return (
    <label className='flex items-center space-x-2 cursor-pointer'>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} required={required} className='size-4' />
      <span className='text-sm text-left text-gray-700'>{label}</span>
    </label>
  )
}

function TextAreaField({ label, value, onChange, placeholder, required = false }) {
  return (
    <div>
      <label className='block mb-2 text-sm font-medium text-left text-gray-700'>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} rows={4} className='w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300'></textarea>
    </div>
  )
}

export default ManageListing
