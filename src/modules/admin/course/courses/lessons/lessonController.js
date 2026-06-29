const lessonModel = require("./lessonModel");
const chapterModel = require("./../chapters/chapterModel");
const courseModel = require("./../coursesModel");

exports.createLesson = async (req, res) => {
  try {
    const { title, slug, content, chapter } = req.body;

    const currentChapter = await chapterModel.findOne({ _id: chapter });
    if (currentChapter) {
      const isLessonDuplicatedByTitleOrSlug = await lessonModel.findOne({
        $or: [{ title }, { slug }],
        chapter,
      });

      const relatedCourse = await courseModel.findOne({
        author: req.session.user,
      });
      if (isLessonDuplicatedByTitleOrSlug) {
        return res.status(409).json({
          message: "آدرس درس یا عنوان آن تکراری میباشد",
        });
      }
      if (relatedCourse) {
        const lesson = await lessonModel.create({
          title,
          slug,
          content,
          chapter,
        });
        const lessonObj = lesson.toObject();
        Reflect.deleteProperty(lessonObj, "__v");
        Reflect.deleteProperty(lessonObj, "_id");
        Reflect.deleteProperty(lessonObj, "chapter");
        Reflect.deleteProperty(lessonObj, "createdAt");
        Reflect.deleteProperty(lessonObj, "updatedAt");
        return res.status(201).json({
          message: "درس شما با موفقیت ایجاد شد",
          lessonObj,
        });
      }

      return res.status(403).json({
        message: "شما قادر به ایجاد درس برای این دوره نخواهید بود",
      });
    }
    return res.status(404).json({
      message: "فصل مورد نظر یافت نشد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal serever error",
      error: e.message,
    });
  }
};

exports.editLesson = async (req, res) => {
  try {
    const { newTitle, newSlug, newContent, lesson } = req.body;
    const currentLesson = await lessonModel.findOne({ _id: lesson });
    if (currentLesson) {
      const isLessonDuplicatedByTitleOrSlug = await lessonModel.findOne({
        $or: [{ title: newTitle }, { slug: newSlug }],
        chapter: currentLesson.chapter,
        _id: { $ne: currentLesson._id },
      });
      if (!isLessonDuplicatedByTitleOrSlug) {
        const relatedCourse = await courseModel.findOne({
          author: req.session.user,
        });

        if (relatedCourse) {
          await lessonModel.updateOne(
            { _id: currentLesson._id },
            {
              $set: {
                title: newTitle,
                slug: newSlug,
                content: newContent,
              },
            },
          );
          return res.json({
            message: "درس شما با موفقیت ویرایش شد",
          });
        }
        return res.status(403).json({
          message: "شما قادر به ویرایش درس برای این دوره نخواهید بود",
        });
      }
      return res.status(409).json({
        message: "آدرس درس یا عنوان آن تکراری میباشد",
      });
    }
    return res.status(404).json({
      message: "فصل مورد نظر پیدا نشد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal serever error",
      error: e.message,
    });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const id = req.query.id;

    const currentLesson = await lessonModel.findOne({ _id: id });
    if (currentLesson) {
      const currentChapter = await chapterModel.findOne({
        _id: currentLesson.chapter,
      });
      const currentCourse = await courseModel.findOne({
        _id: currentChapter.course,
      });
      if (currentCourse.author.equals(req.session.user)) {
        await lessonModel.deleteOne({ _id: id });

        return res.json({
          message: "درس شما با موفقیت حذف شد",
        });
      }
      return res.status(403).json({
        message: "شما قادر به حذف این درس نیستید",
      });
    }
    return res.status(404).json({
      message: "درس مورد نظر شما پیدا نشد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal serever error",
      error: e.message,
    });
  }
};

exports.getAllLessonsByAuthor = async (req, res) => {
  try {
    const courses = await courseModel
      .find({ author: req.session.user })
      .select("_id");

    const chapters = await chapterModel
      .find({
        course: { $in: courses.map((course) => course._id) },
      })
      .select("_id title")
      .sort({ createdAt: 1 });

    const lessonsObj = [];

    for (const chapter of chapters) {
      const lessons = await lessonModel
        .find({ chapter: chapter._id })
        .select("_id title slug content")
        .sort({ createdAt: 1 });

      lessonsObj.push({
        chapterId: chapter._id,
        chapterTitle: chapter.title,
        lessons,
      });
    }
    return res.json({
      message: "اطلاعات با موفقیت دریافت شد",
      lessonsObj,
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal serever error",
      error: e.message,
    });
  }
};
