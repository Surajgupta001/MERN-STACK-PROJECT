import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import ResumePreview from '../components/ResumePreview';
import { ArrowLeftIcon } from 'lucide-react';
import api from '../configs/api';

function Preview() {

  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    try {
      const { data } = await api.get(`/api/v1/resumes/public/${resumeId}`);
      setResumeData(data.resume);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume()
  }, []);

  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl py-10 mx-auto'>
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='py-4 bg-white' />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? <Loader /> : (
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-6xl font-medium text-center text-slate-400'>No resume found</p>
          <a href="/" className='flex items-center px-6 m-1 mt-6 text-white transition bg-green-500 rounded-full hover:bg-green-600 h-9 ring-offset-1 ring-1 ring-green-400'>
            <ArrowLeftIcon className='w-4 h-4 mr-2' />
            go to home page
          </a>
        </div>
      )}
    </div>
  );
}

export default Preview
