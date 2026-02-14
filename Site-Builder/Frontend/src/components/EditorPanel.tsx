import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface EditorPanelProps {
    selectedElement: {
        tagName: string;
        text: string;
        className?: string;
        styles: {
            padding: string;
            margin: string;
            backgroundColor: string;
            color: string;
            fontSize: string;
        };
    } | null;
    onUpdate: (updates: any) => void;
    onClose: () => void;
};

function EditorPanel({ selectedElement, onUpdate, onClose }: EditorPanelProps) {

    const [values, setValues] = useState(selectedElement);

    useEffect(() => {
        setValues(selectedElement);
    }, [selectedElement]);

    if (!selectedElement || !values) return null;

    const handleChange = (field: string, value: string) => {
        const newvalue = {
            ...values, [field]: value
        };
        setValues(newvalue);
        onUpdate({ [field]: value });
    };

    const handleStyleChange = (styleName: string, value: string) => {
        const newStyles = {
            ...values.styles, [styleName]: value
        };
        setValues({
            ...values, styles: newStyles
        });
        onUpdate({ styles: { [styleName]: value } });
    };

    return (
        <div className='absolute z-50 p-4 bg-white border border-gray-200 rounded-lg shadow-xl top-4 right-4 w-80 animate-fade-in fade-in'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-gray-800'>Edit Element</h3>
                <button onClick={onClose} className='p-1 rounded-full hover:bg-gray-100'>
                    <X className='w-4 h-4 text-gray-500' />
                </button>
            </div>
            <div className='space-y-4 text-black'>
                <div>
                    <label className='block mb-1 text-xs font-medium text-gray-500'>Text Content</label>
                    <textarea value={values.text} onChange={(e) => handleChange('text', e.target.value)} className='w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 min-h-20' />
                </div>
                <div>
                    <label className='block mb-1 text-xs font-medium text-gray-500'>Class Name</label>
                    <input type='text' value={values.className || ''} onChange={(e) => handleChange('className', e.target.value)} className='w-full p-2 text-sm border border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-indigo-500' />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block mb-1 text-xs font-medium text-gray-500'>Padding</label>
                        <input type='text' value={values.styles.padding} onChange={(e) => handleStyleChange('padding', e.target.value)} className='w-full p-2 text-sm border border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-indigo-500' />
                    </div>
                    <div>
                        <label className='block mb-1 text-xs font-medium text-gray-500'>Margin</label>
                        <input type='text' value={values.styles.margin} onChange={(e) => handleStyleChange('margin', e.target.value)} className='w-full p-2 text-sm border border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-indigo-500' />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block mb-1 text-xs font-medium text-gray-500'>Font Size</label>
                        <input type='text' value={values.styles.fontSize} onChange={(e) => handleStyleChange('fontSize', e.target.value)} className='w-full p-2 text-sm border border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-indigo-500' />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block mb-1 text-xs font-medium text-gray-500'>Background</label>
                        <div className='flex items-center gap-2 p-1 border border-gray-400 rounded-md'>
                            <input type='color' value={values.styles.backgroundColor === 'rgba(0,0,0,0)' ? '#ffffff' : values.styles.backgroundColor} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className='w-6 h-6 cursor-pointer' />
                            <span className='text-xs text-gray-600 truncate'>{values.styles.backgroundColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className='block mb-1 text-xs font-medium text-gray-500'>Text Color</label>
                        <div className='flex items-center gap-2 p-1 border border-gray-400 rounded-md'>
                            <input type='color' value={values.styles.color === 'rgba(0,0,0,0)' ? '#000000' : values.styles.color} onChange={(e) => handleStyleChange('color', e.target.value)} className='w-6 h-6 cursor-pointer' />
                            <span className='text-xs text-gray-600 truncate'>{values.styles.color}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditorPanel
