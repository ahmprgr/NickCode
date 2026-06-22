const courseModel = require("./coursesModel");
const userModel = require("./../../../user/auth/userModel");
const fs = require("fs");
const path = require("path");

exports.createCourse = async (req, res) => {
  try {
    const { title, slug, description, prerequisites, category } = req.body;
    const coverImage = `/uploads/img/${req.file.filename}`;
    const isDuplicatedTitle = await courseModel.findOne({ title });
    const isDuplicatedSlug = await courseModel.findOne({ slug });

    if (isDuplicatedSlug || isDuplicatedTitle) {
      return res.status(409).json({
        message: "آدرس دوره یا عنوان آن تکراری میباشد",
      });
    } else {
      const prerequisitesArr = prerequisites.split(",");
      const course = await courseModel.create({
        title,
        cover: coverImage,
        slug,
        description,
        prerequisites: prerequisitesArr,
        category,
        author: req.session.user,
        coverImage,
      });
      const courseObj = course.toObject();
      Reflect.deleteProperty(courseObj, "_id");
      Reflect.deleteProperty(courseObj, "__v");
      Reflect.deleteProperty(courseObj, "createdAt");
      Reflect.deleteProperty(courseObj, "rating");
      Reflect.deleteProperty(courseObj, "students");
      Reflect.deleteProperty(courseObj, "commentCount");
      Reflect.deleteProperty(courseObj, "updatedAt");
      return res.status(201).json({
        message: "دوره جدید با موفقیت ساخته شد",
        courseObj,
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const {
      newTitle,
      newSlug,
      newDescription,
      newPrerequisites,
      newCategory,
      oldSlug,
    } = req.body;
    const currentCourse = await courseModel.findOne({ slug: oldSlug });
    if (currentCourse) {
      const coverImage = req.file
        ? `/uploads/img/${req.file.filename}`
        : currentCourse.coverImage;
      const isDuplicatedTitle = await courseModel.findOne({
        _id: { $ne: currentCourse._id },
        title: newTitle,
      });
      const isDuplicatedSlug = await courseModel.findOne({
        _id: { $ne: currentCourse._id },
        slug: newSlug,
      });
      if (isDuplicatedSlug || isDuplicatedTitle) {
        return res.status(409).json({
          message: "آدرس دوره یا عنوان آن تکراری میباشد",
        });
      } else {
        const isAuthor = currentCourse.author.equals(req.session.user);
        if (!isAuthor) {
          return res.status(403).json({
            message: "شما قادر به ویرایش این دوره نخواهید بود",
          });
        } else {
        }
        if (req.file && currentCourse.coverImage) {
          const oldCoverPath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "public",
            currentCourse.coverImage.startsWith("/")
              ? currentCourse.coverImage.slice(1)
              : currentCourse.coverImage,
          );
          fs.unlink(oldCoverPath, (e) => {
            if (e) console.log(e);
          });
        }
        const prerequisitesArr = newPrerequisites.split(",");
        await courseModel.updateOne(
          { _id: currentCourse._id },
          {
            $set: {
              title: newTitle,
              description: newDescription,
              prerequisites: prerequisitesArr,
              slug: newSlug,
              category: newCategory,
              coverImage,
            },
          },
        );
        return res.json({
          message: "دوره با موفقیت ویرایش شد",
        });
      }
    } else {
      return res.status(404).json({
        message: "دوره ای با این مشخصات پیدا نشد",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const id = req.query.id;
    const course = await courseModel.findOne({ _id: id });
    if (course) {
      isAuthor = course.author.equals(req.session.user);
      if (!isAuthor) {
        return res.status(403).json({
          message: "شما قادر به حذف این دوره نخواهید بود",
        });
      } else {
        const coverPath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "public",
          course.coverImage,
        );
        fs.unlink(coverPath, (e) => {
          if (e) console.log(e);
        });
        await courseModel.deleteOne({ _id: id });
        return res.json({
          message: "دوره با موفقیت حذف شد",
        });
      }
    } else {
      return res.status(404).json({
        message: "دوره ای با این مشخصات پیدا نشد",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.getAllCourse = async (req, res) => {};
