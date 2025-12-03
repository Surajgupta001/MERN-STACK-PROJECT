import Course from "../models/course.models.js";

// Get ALl Courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            isPublished: true
        }).select(['-courseContent', '-enrolledStudents']).populate({path: 'educator'});

        res
        .status(200)
        .json({
            success: true,
            message: "All Courses fetched successfully",
            courses
        });
    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Get Course By ID
export const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const courseData = await Course.findById(id).populate({path: 'educator'});

        // Remove lecture url if isPreview is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            });
        });

        res
        .status(200)
        .json({
            success: true,
            message: "All Courses fetched successfully through ID",
            courseData
        });
    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};