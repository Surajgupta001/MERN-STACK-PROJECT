import { Check, Palette } from 'lucide-react';
import React, { useState } from 'react'

function ColorPicker({ selectedColor, onChange }) {

    const colors = [
        { name: 'Green', value: '#10B981' },
        { name: 'Indigo', value: '#6366F1' },
        { name: 'Purple', value: '#8B5CF6' },
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Teal', value: '#14B8A6' },
        { name: 'Yellow', value: '#F59E0B' },
        { name: 'Orange', value: '#FB923C' },
        { name: 'Red', value: '#EF4444' },
        { name: 'Slate', value: '#64748B' },
        { name: 'Rose', value: '#F43F5E' },
    ];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='relative'>
            <button className='flex items-center gap-1 px-3 py-2 text-purple-600 transition rounded-lg texts-m bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring-all' onClick={() => setIsOpen((prev) => !prev)} >
                <Palette size={16} />
                <span className='max-sm:hidden'>Accent</span>
            </button>
            {isOpen && (
                <div className='absolute left-0 right-0 z-10 grid grid-cols-4 gap-2 p-3 mt-2 bg-white border border-gray-200 rounded-md shadow-sm w-60 top-full'>
                    {colors.map((color) => (
                        <div onClick={() => { onChange(color.value); setIsOpen(false); }} key={color.value} className='relative flex flex-col items-center cursor-pointer group'>
                            <div className='w-12 h-12 transition border-2 border-transparent rounded-full group-hover:border-black/25' style={{ backgroundColor: color.value }}></div>
                            {selectedColor === color.value && (
                                <div className='absolute inset-0 flex items-center justify-center'>
                                    <Check className='w-5 h-5 text-white' />
                                </div>
                            )}
                            <p className='mt-1 text-xs text-center text-gray-600'>{color.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ColorPicker
