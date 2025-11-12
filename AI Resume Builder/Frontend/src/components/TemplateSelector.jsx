import { Check, Layout } from 'lucide-react';
import React, { useState } from 'react'

function TemplateSelector({ selectedTemplate, onChange }) {

    const [isOpen, setIsOpen] = useState(false);

    const templates = [
        {
            id: "classic",
            name: "Classic",
            preview: 'A clean traditional resume format with clear sections and professional typography.'
        },
        {
            id: "modern",
            name: "Modern",
            preview: 'A sleek and contemporary resume format with bold typography and a clean layout.'
        },
        {
            id: "minimal-image",
            name: "Minimal (Image)",
            preview: 'A clean and simple resume format with a focus on your skills and experience, featuring an optional profile image.'
        },
        {
            id: "minimal",
            name: "Minimal",
            preview: 'A clean and simple resume format with a focus on your skills and experience.'
        },
    ];

    return (
        <div className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1 px-3 py-2 text-sm text-blue-600 transition rounded-lg bg-linear-to-br from-blue-50 to-blue-100 ring-blue-300 hover:shadow'>
                <Layout size={14} />
                <span className='sm:hidden lg:inline'>Template</span>
            </button>
            {
                isOpen && (
                    <div className='absolute z-10 w-64 p-3 mt-2 space-y-3 bg-white border border-gray-200 rounded-md shadow-sm top-full'>
                        {templates.map((template) => (
                            <div key={template.id} onClick={() => { onChange(template.id); setIsOpen(false); }} className={`p-3 border rounded-md cursor-pointer relative transition-all ${selectedTemplate === template.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-100'}`}>
                                {selectedTemplate === template.id && (
                                    <div className='absolute top-2 right-2'>
                                        <div className='flex items-center justify-center w-5 h-5 bg-blue-400 rounded-full'>
                                            <Check className='w-3 h-3 text-white' />
                                        </div>
                                    </div>
                                )}
                                <div className='space-y-1'>
                                    <h4 className='font-medium text-gray-800'>{template.name}</h4>
                                    <div className='p-2 mt-2 text-xs italic text-gray-500 rounded bg-blue-50'>{template.preview}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default TemplateSelector
