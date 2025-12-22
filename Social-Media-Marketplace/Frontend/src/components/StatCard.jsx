import React from 'react'

function StatCard({ title, value, icon, color }) {

    const colorMap = {
        indigo: 'bg-indigo-100',
        green: 'bg-green-100',
        yellow: 'bg-yellow-100',
    };

    return (
        <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm font-medium text-left text-gray-600'>{title}</p>
                    <p className='text-2xl font-bold text-left text-gray-800'>{value}</p>
                </div>
                <div className={`size-12 ${colorMap[color]} rounded-full flex items-center justify-center`}>{icon}</div>
            </div>
        </div>
    )
}

export default StatCard
