import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';

function MyEnrollment() {

  const { enrolledCourses, calculateCourseDuration, navigate } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 2, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 7 },
    { lectureCompleted: 4, totalLectures: 8 },
    { lectureCompleted: 10, totalLectures: 10 },
    { lectureCompleted: 6, totalLectures: 12 },
    { lectureCompleted: 7, totalLectures: 14 },
    { lectureCompleted: 8, totalLectures: 16 },
    { lectureCompleted: 9, totalLectures: 18 },
    { lectureCompleted: 10, totalLectures: 20 },
    { lectureCompleted: 11, totalLectures: 22 },
    { lectureCompleted: 12, totalLectures: 24 },
    { lectureCompleted: 13, totalLectures: 26 }
  ]);

  return (
    <>
      <div className='px-8 pt-10 md:px-36'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>
        <table className='w-full mt-10 overflow-hidden border table-fixed md:table-auto'>
          <thead className='text-sm text-left text-gray-900 border-b border-gray-500/20 max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {enrolledCourses.map((course, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='flex items-center py-3 pl-2 space-x-3 md:px-4 md:pl-4'>
                  <img className='w-14 sm:w-24 md:w-28' src={course.courseThumbnail} alt="" />
                  <div className='flex-1'>
                    <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                    <Line
                      percent={progressArray[index] ? (progressArray[index].lectureCompleted / progressArray[index].totalLectures) * 100 : 0}
                      strokeWidth={6}
                      trailWidth={6}
                      strokeColor="#1677FF"
                      trailColor="#E5E7EB"
                      strokeLinecap="round"
                      className='w-40 sm:w-56 md:w-64'
                    />
                  </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  {calculateCourseDuration(course)}
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`} <span>Lectures</span>
                </td>
                <td className='px-4 py-3 max-sm:text-right'>
                  <button onClick={() => navigate('/player/' + course._id)} className={`px-3 sm:px-5 py-1.5 sm:py-2 max-sm:text-xs text-white ` + (progressArray[index] && progressArray[index].lectureCompleted === progressArray[index].totalLectures ? 'bg-green-600' : 'bg-blue-600')}>
                    {progressArray[index] && (progressArray[index].lectureCompleted === progressArray[index].totalLectures ? 'Completed' : 'On Going')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div >
      <Footer />
    </>
  )
}

export default MyEnrollment
