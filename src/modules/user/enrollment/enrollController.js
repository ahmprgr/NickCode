const enrollModel = require("./enrollModel");
const courseModel = require("./../../admin/course/courses/coursesModel");
const userModel = require("./../auth/userModel");
const lessonModel = require("./../../admin/course/courses/lessons/lessonModel");
const chapterModel = require("./../../admin/course/courses/chapters/chapterModel");

exports.enroll = async (req, res) => {
  try {
    const { course } = req.body;
    const isCourseExits = await courseModel.findOne({ _id: course });
    if (isCourseExits) {
      const isEnrollmentExists = await enrollModel.findOne({
        course,
        user: req.session.user,
      });
      if (isEnrollmentExists) {
        return res.status(409).json({
          message: "شما از قبل در این دوره ثبت نام کرده اید",
        });
      }
      await enrollModel.create({
        user: req.session.user,
        course,
      });
      return res.status(201).json({
        message: "شما با موفقیت در دوره ثبت نام شدید",
      });
    }
    return res.status(404).json({
      message: "دوره مورد نظر شما وجود ندارد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.getAllEnrolledCourses = async (req, res) => {
  try {
    const findCoursesInUserEnrollmentCollection = await enrollModel
      .find({
        user: req.session.user,
      })
      .select("course");
    const courses = await courseModel
      .find({
        _id: {
          $in: findCoursesInUserEnrollmentCollection.map(
            (enrollment) => enrollment.course,
          ),
        },
      })
      .select("_id coverImage title author");
    const enrolledCourses = [];

    for (const course of courses) {
      const author = await userModel
        .findOne({ _id: course.author })
        .select("fullname");
      const enrollmentInfos = await enrollModel
        .findOne({
          course: course._id,
        })
        .select("-_id completedLessons progress");
      enrolledCourses.push({
        cover: course.coverImage,
        title: course.title,
        author: author.fullname,
        enrollmentInfos,
      });
    }
    return res.json({
      message: "اطلاعات با موفقیت دریافت شد",
      enrolledCourses,
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.setLessonViewed = async (req, res) => {
  try {
    const { slug, chapter } = req.body;
    const currentLesson = await lessonModel.findOne({ slug });
    if (currentLesson) {
      const currentChapter = await chapterModel.findOne({ _id: chapter });
      if (currentChapter) {
        const currentCourse = await courseModel.findOne({
          _id: currentChapter.course,
        });
        if (currentCourse) {
          await enrollModel.updateOne(
            {
              user: req.session.user,
              course: currentCourse._id,
            },
            {
              $addToSet: {
                completedLessons: currentLesson._id,
              },
            },
          );
          return res.json({
            message: "درس با موفقیت در لیست درس های خوانده شده ثبت شد",
          });
        }
        return res.status(404).json({
          message: "دوره ای با این مشخصات پیدا نشد",
        });
      }
      return res.status(404).json({
        message: "فصلی با این مشخصات پیدا نشد",
      });
    }
    return res.status(404).json({
      message: "درسی با این مشخصات پیدا نشد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.isCourseEnrolled = async (req, res) => {
  try {
    const id = req.body.id;
    const findEnrolledCourse = await enrollModel.findOne({
      user: req.session.user,
      course: id,
    });
    if (findEnrolledCourse) {
      return res.json({
        message: "شما از قبل در این دوره ثبت نام کرده اید"
      })
    }
    return res.status(403).json({
      message:"لطفا برای استفاده از محتوای این دوره اول اقدام به ثبت نام در این دوره کنید"
    })
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};
