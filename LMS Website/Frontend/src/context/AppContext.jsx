import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);

    // Fetch All Courses - to be used globally
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    };

    // Function to calculate average rating of course (uses `courseRatings` from dummy data)
    const calculateRating = (course) => {
        const ratings = course?.courseRatings;
        if (!Array.isArray(ratings) || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, entry) => {
            if (typeof entry === 'number') return sum + entry;
            if (entry && typeof entry === 'object') return sum + (Number(entry.rating) || 0);
            return sum;
        }, 0);
        return total / ratings.length;
    };

    // Function to calculate Course Chapter Time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration);
        return humanizeDuration(time * 60 * 1000, {unit: ['h', 'm']});
    };

    // Function to calculate Course Duration
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration));
        return humanizeDuration(time * 60 * 1000, {unit: ['h', 'm']});
    };

    // Function to calculate to number of lectures in the course
    const calculateNumberOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    };

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const value = {
        // Add global state values and functions here
        currency,
        allCourses,
        setAllCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNumberOfLectures
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}