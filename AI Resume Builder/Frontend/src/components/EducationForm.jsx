import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import React from 'react'

function EducationForm({ data, onChange }) {

    const addEducation = () => {
        const newEducation = {
            institution: '',
            degree: '',
            field: '',
            graduation_date: '',
            gpa: ''
        };
        onChange([...data, newEducation]);
    };

    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    };

    const updateEducation = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Education</h3>
                    <p className='text-sm text-gray-600'>Add your education details here</p>
                </div>
                <button onClick={addEducation} className='flex items-center gap-2 px-3 py-1 text-sm text-green-700 transition-colors bg-green-100 rounded-lg hover:bg-green-200'>
                    <Plus className='w-4 h-4' />
                    Add Education
                </button>
            </div>
            {data.length === 0 ? (
                <div className='py-8 text-center text-gray-500'>
                    <GraduationCap className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p>No education added yet.</p>
                    <p className='text-sm'>Click "Add Education" to get started.</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((education, index) => (
                        <div key={index} className='p-4 space-y-3 border border-gray-200 rounded-lg'>
                            <div className='flex items-start justify-between'>
                                <h4>Education #{index + 1}</h4>
                                <button onClick={() => removeEducation(index)} className='text-red-500 transition-colors hover:text-red-700'>
                                    <Trash2 className='w-5 h-5' />
                                </button>
                            </div>
                            <div className='grid gap-3 md:grid-cols-2'>
                                <input onChange={(e) => updateEducation(index, 'institution', e.target.value)} value={education.institution || ''} type="text" placeholder='Institution Name' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                                <input onChange={(e) => updateEducation(index, 'degree', e.target.value)} value={education.degree || ''} type="text" placeholder='Degree (e.g. B.Sc, M.Sc, Ph.D)' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                                <input onChange={(e) => updateEducation(index, 'field', e.target.value)} value={education.field || ''} type="text" placeholder='Field of Study' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                                <input onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)} value={education.graduation_date || ''} type="month" className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                            </div>
                                <input onChange={(e) => updateEducation(index, 'gpa', e.target.value)} value={education.gpa || ''} type="text" placeholder='GPA (optional)' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EducationForm
