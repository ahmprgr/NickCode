const courseModel = require("./../modules/admin/course/courses/coursesModel");

exports.getCourses = async (req, res) => {
  try {
    const allCourses = await courseModel.find().lean();
    allCourses.forEach((course) => {
      Reflect.deleteProperty(course, "createdAt");
      Reflect.deleteProperty(course, "updatedAt");
      Reflect.deleteProperty(course, "_id");
      Reflect.deleteProperty(course, "__v");
    });
    return res.json({
      message: "اطلاعات با موفقیت دریافت شد",
      allCourses,
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};
exports.getCourseBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const findCourseBySlug = await courseModel.findOne({ slug });
    if (findCourseBySlug) {
      const courseObj = findCourseBySlug.toObject();
      Reflect.deleteProperty(courseObj, "createdAt");
      Reflect.deleteProperty(courseObj, "updatedAt");
      Reflect.deleteProperty(courseObj, "_id");
      Reflect.deleteProperty(courseObj, "__v");
      return res.json({
        message: "اطلاعات با موفقیت دریافت شد",
        courseObj,
      });
    } else {
      return res.status(404).json({
        message: "دوره مورد نظر پیدا نشد",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};
