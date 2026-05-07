import { format } from 'date-fns';
import { DownloadIcon } from 'lucide-react';
import React from 'react'

function PayslipList({ payslips, isAdmin }) {
    return (
        <div className='overflow-hidden card'>
            <div className='overflow-auto'>
                <table className='table-modern'>
                    <thead>
                        <tr>
                            {isAdmin && <th>Employee</th>}
                            <th>Period</th>
                            <th>Basic Salary</th>
                            <th>Net Salary</th>
                            {<th className='text-center'>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {payslips.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} className='py-12 text-center text-slate-480'>
                                    No payslips found.
                                </td>
                            </tr>
                        ) : (
                            payslips.map((payslip) => {
                                const recId = payslip._id || payslip.id;
                                return (
                                    <tr key={recId}>
                                        {isAdmin && (
                                            <td className=' text-slate-900'>{payslip.employee?.firstName} {payslip.employee?.lastName}</td>
                                        )}
                                        <td className='text-slate-500'>
                                            {format(new Date(payslip.year, payslip.month - 1), 'MMMM yyyy')}
                                        </td>
                                        <td className='text-slate-500'>
                                            ${payslip.basicSalary?.toLocaleString()}
                                        </td>
                                        <td className='font-medium text-slate-500'>
                                            ${payslip.netSalary?.toLocaleString()}
                                        </td>
                                        <td className='text-center'>
                                            <button onClick={() => window.open(`/print/payslips/${payslip._id || payslip.id}`)} className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 transition-colors ring-1 ring-blue-600/10'>
                                                <DownloadIcon className='w-3 h-3 mr-1.5' /> Download
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PayslipList