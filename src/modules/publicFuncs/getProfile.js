const userModel = require("./../user/auth/userModel");
const enrollModel = require("./../user/enrollment/enrollModel");
const courseModel = require("./../admin/course/courses/coursesModel");

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const findUserByUserId = await userModel
      .findOne({ userid: userId })
      .select("_id userid email profile role");
    const findUserEnrolledCourse = await enrollModel.find({
      user: findUserByUserId._id,
    });
    if (findUserByUserId) {
      if (findUserByUserId.role === "user") {
        let lessonsCount = 0;
        findUserEnrolledCourse.forEach((c) => {
          lessonsCount += c.completedLessons;
        });
        return res.json({
          message: "اطلاعات با موفقیت دریافت شد",
          userObj: findUserByUserId,
          enrolledCourse: findUserEnrolledCourse,
          moreInfo: {
            courses: findUserEnrolledCourse.length,
            completedLessons: lessonsCount,
          },
        });
      } else {
        const getCoursesByAuthorId = await courseModel.find({
          author: findUserByUserId._id,
        }).select("title slug description category coverImage level prerequisites status students");
        return res.json({
          message: "اطلاعات با موفقیت دریافت شد",
          adminInfo: findUserByUserId,
          courses: getCoursesByAuthorId,
        });
      }
    }
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};
