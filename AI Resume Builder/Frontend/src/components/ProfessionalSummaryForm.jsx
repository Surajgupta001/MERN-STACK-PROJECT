import { Sparkles } from 'lucide-react'
import React from 'react'

function ProfessionalSummaryForm({ data, onChange, setResumeData }) {
    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
                    <p className='text-sm text-gray-600'>Add Summary for your resume here</p>
                </div>
                <button className='flex items-center gap-2 px-3 py-1 text-sm text-purple-700 transition-colors bg-purple-100 rounded hover:bg-purple-200 disabled:opacity-50'>
                    <Sparkles className='w-4 h-4' />
                    AI Enhance
                </button>
            </div>
            <div className='mt-6'>
                <textarea onChange={(e) => onChange(e.target.value)} value={data || ''} className='w-full p-3 px-4 mt-2 text-sm transition-colors border border-gray-300 rounded-lg outline-none resize-none focus:ring focus:ring-blue-500 focus:border-blue-500' rows={7} placeholder='Write a compelling summary that highlight your key strengths and career objectives....' />
                <p className='mx-auto text-xs text-center text-gray-500 max-w-4/5'>Tip: Keep it concise(3-4 sentence) and focus on your most relevant achievements and skills.</p>
            </div>
        </div>
    )
}

export default ProfessionalSummaryForm
