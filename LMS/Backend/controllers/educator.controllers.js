import { clerkClient } from "@clerk/express";
import Course from "../models/course.models.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/purchase.models.js";
import User from "../models/user.models.js";

// Update user role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth().userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.status(200).json({
      success: true,
      message: "You can publish a course now",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user role to educator",
    });
  }
};

// Add New course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth().userId;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Course thumbnail is required",
      });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });

    res.status(200).json({
      success: true,
      message: "Educator courses fetched successfully",
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Educator Dashboard data (Total Earning, Enrolled Students, No, of Courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseId = courses.map((course) => course._id);

    // Calculate total earning from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseId },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (total, purchase) => total + purchase.amount,
      0
    );

    // Collect unique enrolled students IDs with their course title
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          studentTitle: course.courseTitle,
          student,
        });
      });
    }

    res.status(200).json({
      success: true,
      message: "Educator dashboard data fetched successfully",
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Enrolled Students Data with purchase Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });

    const courseId = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseId },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.status(200).json({
      success: true,
      message: "Enrolled students data fetched successfully",
      enrolledStudents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
