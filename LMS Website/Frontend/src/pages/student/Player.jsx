import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';

function Player() {

  const { enrolledCourses, calculateChapterTime, navigate } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const getCourseData = () => {
    if (!Array.isArray(enrolledCourses) || enrolledCourses.length === 0) return;
    const found = enrolledCourses.find((course) => course._id === courseId);
    setCourseData(found || null);
  };

  // Function to toggle section open/close
  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses, courseId]);

  return (
    <>
      <div className='flex flex-col-reverse gap-10 p-4 sm:p-10 md:grid md:grid-cols-2 md:px-36'>
        {/* Left Column */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>
          <div className='pt-5'>
            {(courseData?.courseContent || []).map((chapter, index) => (
              <div key={index} className='mb-2 bg-white border border-gray-300 rounded'>
                <div onClick={() => toggleSection(index)} className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'>
                  <div className='flex items-center gap-2'>
                    <img className={`transform transition-transform duration-300 ${openSection[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="" />
                    <p className='text-sm font-medium md:text-base'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className='py-2 pl-4 pr-4 text-gray-600 list-disc border-t border-gray-300 md:pl-10'>
                    {(chapter.chapterContent || []).map((lecture, i) => (
                      <li key={i} className='flex items-start gap-2 py-1'>
                        <img className='w-4 h-4 mt-1' src={false ? assets.blue_tick_icon : assets.play_icon} alt="play_icon" />
                        <div className='flex items-center justify-between w-full text-xs text-gray-800 md:text-default'>
                          <p>{lecture.lectureTitle}</p>
                          <div className='flex gap-2'>
                            {lecture.lectureUrl && <p onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })} className='text-blue-500 cursor-pointer'>Watch</p>}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate This Course:</h1>
            <Rating initialrating={0} />
          </div>
        </div>

        {/* Right Column */}
        <div className='md:mt-10'>
          {
            playerData ? (
              <div>
                <div className='relative w-full aspect-video'>
                  <YouTube
                    videoId={playerData.lectureUrl.split('/').pop()}
                    className='absolute inset-0'
                    iframeClassName='absolute inset-0 w-full h-full rounded-md'
                    opts={{ width: '100%', height: '100%', playerVars: { rel: 0, modestbranding: 1 } }}
                  />
                </div>
                <div className='flex items-center justify-between mt-2'>
                  <p className='text-sm font-medium text-gray-800 md:text-base'>
                    {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                  </p>
                  <button className='text-blue-600 hover:underline'>{false ? 'Completed' : 'Mark Complete'}</button>
                </div>
              </div>
            ) : (
              courseData?.courseThumbnail ? (
                <img src={courseData.courseThumbnail} alt="Course thumbnail" />
              ) : null
            )
          }
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Player
