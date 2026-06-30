const chapterModel = require("./chapterModel");
const courseModel = require("./../coursesModel");

exports.createChapter = async (req, res) => {
  try {
    const { title, course } = req.body;
    const isDuplicatedChapter = await chapterModel.findOne({
      title,
      course,
    });
    const isCourseAndAuthorExists = await courseModel.findOne({
      _id: course,
      author: req.session.user,
    });

    if (isDuplicatedChapter) {
      return res.status(409).json({
        message: "عنوان فصل تکراری میباشد",
      });
    }
    if (isCourseAndAuthorExists) {
      const chapter = await chapterModel.create({
        title,
        course,
      });
      const chapterObj = chapter.toObject();

      Reflect.deleteProperty(chapterObj, "_id");
      Reflect.deleteProperty(chapterObj, "__v");
      Reflect.deleteProperty(chapterObj, "createdAt");
      Reflect.deleteProperty(chapterObj, "updatedAt");

      return res.status(201).json({
        message: "فصل شما با موفقیت ساخته شد",
        chapterObj,
      });
    }
    return res.status(403).json({
      message:
        "دوره ای با این اطلاعات وجود ندارد یا شما نویسنده این دوره نیستید",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.editChapter = async (req, res) => {
  try {
    const { newTitle, chapterId } = req.body;
    const isChapterExists = await chapterModel.findOne({
      title: newTitle,
      _id: { $ne: chapterId },
    });
    if (isChapterExists) {
      return res.status(409).json({
        message: "فصلی با این مشخصات وجود دارد",
      });
    }
    const updateChapter = await chapterModel.updateOne(
      { _id: chapterId },
      {
        $set: {
          title: newTitle,
        },
      },
    );

    if (updateChapter.matchedCount === 1) {
      return res.json({
        message: "فصل شما با موفقیت ویرایش شد",
      });
    }
    return res.status(404).json({
      message: "فصلی با این مشخصات پیدا نشد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const id = req.query.id;
    const currentChapter = await chapterModel.findOne({ _id: id });
    if (currentChapter) {
      const course = await courseModel.findOne({
        _id: currentChapter.course,
        author: req.session.user,
      });

      if (course) {
        await chapterModel.deleteOne({ _id: id });

        return res.json({
          message: "فصل شما با موفقیت حذف شد",
        });
      }
      return res.status(403).json({
        message: "شما قادر به حذف این فصل نخواهید بود",
      });
    }

    return res.status(404).json({
      message: "فصلی با این مشخصات پیدا نشد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.getAllChapterByAuthor = async (req, res) => {
  try {
    const courses = await courseModel.find({
      author: req.session.user,
    });

    const chaptersObj = [];

    for (const course of courses) {
      const chapters = await chapterModel
        .find({ course: course._id })
        .select("_id title course")
        .sort({ createdAt: 1 });

      chaptersObj.push({
        courseId: course._id,
        courseTitle: course.title,
        chapters,
      });
    }

    return res.json({
      message: "اطلاعات با موفقیت دریافت شد",
      chaptersObj,
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};
