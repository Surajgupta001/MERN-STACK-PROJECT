import { Briefcase, Plus, Sparkles, Trash2 } from 'lucide-react'
import React from 'react'

function ExperienceForm({ data, onChange }) {

    const addExperience = () => {
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false
        };
        onChange([...data, newExperience]);
    };

    const removeExperience = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    };

    const updateExperience = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
                    <p className='text-sm text-gray-600'>Add your work experience here</p>
                </div>
                <button onClick={addExperience} className='flex items-center gap-2 px-3 py-1 text-sm text-green-700 transition-colors bg-green-100 rounded-lg hover:bg-green-200'>
                    <Plus className='w-4 h-4' />
                    Add Experience
                </button>
            </div>
            {data.length === 0 ? (
                <div className='py-8 text-center text-gray-500'>
                    <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p>No work experience added yet.</p>
                    <p className='text-sm'>Click "Add Experience" to get started.</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((experience, index) => (
                        <div key={index} className='p-4 space-y-3 border border-gray-200 rounded-lg'>
                            <div className='flex items-start justify-between'>
                                <h4>Experience #{index + 1}</h4>
                                <button onClick={() => removeExperience(index)} className='text-red-500 transition-colors hover:text-red-700'>
                                    <Trash2 className='w-5 h-5' />
                                </button>
                            </div>
                            <div className='grid gap-3 md:grid-cols-2'>
                                <input onChange={(e) => updateExperience(index, 'company', e.target.value)} value={experience.company || ''} type="text" placeholder='Company Name' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                                <input onChange={(e) => updateExperience(index, 'position', e.target.value)} value={experience.position || ''} type="text" placeholder='Job Title' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                                <input onChange={(e) => updateExperience(index, 'start_date', e.target.value)} value={experience.start_date || ''} type="month" placeholder='Start Date' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                                <input onChange={(e) => updateExperience(index, 'end_date', e.target.value)} value={experience.end_date || ''} type="month" placeholder='End Date' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 disabled:bg-gray-100' disabled={experience.is_current} />
                            </div>
                            <label className='flex items-center gap-2'>
                                <input type="checkbox" checked={experience.is_current} onChange={(e) => updateExperience(index, 'is_current', e.target.checked ? true : false)} className='text-blue-600 border-gray-300 rounded focus:ring-blue-500' />
                                <span className='text-sm text-gray-700'>Currently working here</span>
                            </label>
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-sm font-medium text-gray-700'>Job Description</label>
                                    <button type='button' className='flex items-center gap-2 px-2 py-1 text-xs text-purple-700 transition-colors bg-purple-100 rounded hover:bg-purple-200'>
                                        <Sparkles className='w-3 h-3' />
                                        Enhance with AI
                                    </button>
                                </div>
                                <textarea onChange={(e) => updateExperience(index, 'description', e.target.value)} value={experience.description || ''} className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' placeholder='Describe your key responsibilities and achievements' rows={4} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperienceForm
