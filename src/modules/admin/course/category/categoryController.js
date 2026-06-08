const categoryModel = require("./categoryModel.js");

exports.createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const isDuplicatedName = await categoryModel.findOne({ name });
    const isDuplicatedSlug = await categoryModel.findOne({ slug });
    if (!isDuplicatedName && !isDuplicatedSlug) {
      const category = await categoryModel.create({
        name,
        slug,
        author: req.session.user._id,
      });
      const categoryObj = category.toObject();
      Reflect.deleteProperty(categoryObj, "createdAt");
      Reflect.deleteProperty(categoryObj, "updatedAt");
      Reflect.deleteProperty(categoryObj, "students");
      Reflect.deleteProperty(categoryObj, "courses");
      Reflect.deleteProperty(categoryObj, "educationalArticles");
      Reflect.deleteProperty(categoryObj, "_id");
      Reflect.deleteProperty(categoryObj, "__v");
      return res.json({
        message: "دسته بندی جدید با موفقیت اضافه شد",
        categoryObj,
      });
    } else {
      return res.status(409).json({
        message: "نام دسته بندی یا آدرس دسته بندی تکراری میباشد",
      });
    }
  } catch (e) {
    if (e) {
      return res.status(500).json({
        message: "internal server error",
        error: e.message,
      });
    }
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { oldSlug, newName, newSlug } = req.body;

    const duplicate = await categoryModel.findOne({
      $or: [{ name: newName }, { slug: newSlug }],
      slug: { $ne: oldSlug },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "نام دسته بندی یا آدرس دسته بندی تکراری میباشد",
      });
    }

    const result = await categoryModel.updateOne(
      { slug: oldSlug },
      { $set: { name: newName, slug: newSlug } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "دسته بندی پیدا نشد",
      });
    }

    return res.status(200).json({
      message: "دسته بندی با موفقیت بروزرسانی شد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.body.id;
    const findCategory = await categoryModel.findOne({ _id: id });
    if (findCategory) {
      await categoryModel.deleteOne({ _id: id });
      return res.json({
        message: "دسته بندی با موفقیت حذف شد",
      });
    } else {
      return res.status(404).json({
        message: "دسته بندی پیدا نشد",
      });
    }
  } catch (e) {
    if (e) {
      return res.status(500).json({
        message: "internal server error",
        error: e.message,
      });
    }
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find().lean();
    if (categories.length) {
      categories.forEach((cat) => {
        Reflect.deleteProperty(cat, "createdAt");
        Reflect.deleteProperty(cat, "updatedAt");
        Reflect.deleteProperty(cat, "_id");
        Reflect.deleteProperty(cat, "__v");
      });

      return res.json({
        message: "اطلاعات با موفقیت دریافت شد",
        categories,
      });
    } else {
      return res.status(404).json({
        message: "دسته بندی پیدا نشد",
      });
    }
  } catch (e) {
    if (e) {
      return res.status(500).json({
        message: "internal server error",
        error: e.message,
      });
    }
  }
};
