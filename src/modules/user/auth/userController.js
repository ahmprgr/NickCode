const userModel = require("./userModel");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

exports.register = async (req, res) => {
  if (!req.session.user) {
    try {
      const userCount = await userModel.countDocuments();
      const { fullname, email, password, confirmPassword } = req.body;
      const duplicatedUser = await userModel.findOne({ email });
      if (!duplicatedUser) {
        if (password === confirmPassword) {
          const hashedPassword = await bcrypt.hash(password, 12);
          const user = await userModel.create({
            fullname,
            email,
            password: hashedPassword,
            userid: userCount >= 2 ? `user_${email}` : `admin_${email}`,
            ...userModel.userid,
            role: userCount >= 2 ? "user" : "admin",
          });
          req.session.user = user;
          const userObj = user.toObject();
          Reflect.deleteProperty(userObj, "password");
          Reflect.deleteProperty(userObj, "createdAt");
          Reflect.deleteProperty(userObj, "updatedAt");
          Reflect.deleteProperty(userObj, "_id");
          Reflect.deleteProperty(userObj, "__v");
          return res.status(201).json({
            message: "ثبت نام با موفقیت انجام شد",
            userObj,
          });
        } else {
          return res.status(422).json({
            message: "رمز عبور با فیلد تکرار تطابق ندارد",
          });
        }
      } else {
        return res.status(409).json({
          message: "این ایمیل تکراری میباشد",
        });
      }
    } catch (e) {
      return res.status(500).json({
        message: "internal server error",
        error: e.message,
      });
    }
  } else {
    return res.status(403).json({
      massage: "شما قبلا احراز هویت شده بوده اید",
    });
  }
};
exports.login = async (req, res) => {
  if (!req.session.user) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      const comparePassword = await bcrypt.compare(password, user.password);
      if (user && comparePassword) {
        req.session.user = user._id;
        return res.json({
          message: "ورود موفقیت آمیز بود",
        });
      } else {
        return res.status(422).json({
          message: "کاربری با این مشخصات وجود ندارد",
        });
      }
    } catch (e) {
      return res.status(500).json({
        message: "internal server error",
        error: e.message,
      });
    }
  } else {
    return res.status(403).json({
      massage: "شما قبلا احراز هویت شده بودید",
    });
  }
};
exports.deleteAccount = async (req, res) => {
  try {
    await userModel.deleteOne({ _id: req.session.user });
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "خروج موفق نبود",
        });
      }
    });
    res.clearCookie("connect.sid");
    return res.json({
      message: "حساب کاربری شما با موفقیت حذف شد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};
exports.editProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.session.user);
    const { newFullname, newPassword, newEmail, userId } = req.body;
    const profile = req.file
      ? `/uploads/img/${req.file.filename}`
      : user.profile;

    const isDuplicatedEmail = await userModel.findOne({
      newEmail,
      _id: { $ne: user._id },
    });

    const isDuplicatedUserId = await userModel.findOne({
      userId,
      _id: { $ne: user._id },
    });

    if (!isDuplicatedEmail && !isDuplicatedUserId) {
      if (req.file && user.profile) {
        const oldProfilePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          user.profile.startsWith("/") ? user.profile.slice(1) : user.profile,
        );
        fs.unlink(oldProfilePath, (e) => {
          if (e) console.log(e);
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      const newUserInfo = await userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            userid: userId,
            email: newEmail,
            fullname: newFullname,
            password: hashedPassword,
            profile,
          },
        },
      );
      return res.json({
        message: "پروفایل با موفقیت ویرایش شد",
      });
    } else {
      return res.status(409).json({
        message: "شناسه کاربری یا ایمیل تکراری میباشد",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "خروج موفق نبود",
        });
      }
    });
    res.clearCookie("connect.sid");
    return res.json({
      message: "شما با موفقیت خارج شده اید",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};
exports.getMe = async (req, res) => {
  try {
    const userId = req.session.user;
    const userInfo = await userModel.findOne({ _id: userId });
    const userObj = userInfo.toObject();
    Reflect.deleteProperty(userObj, "password");
    Reflect.deleteProperty(userObj, "createdAt");
    Reflect.deleteProperty(userObj, "updatedAt");
    Reflect.deleteProperty(userObj, "_id");
    Reflect.deleteProperty(userObj, "__v");
    return res.json({
      message: "اطلاعات کاربر با موفقیت دریافت شد",
      user: userObj,
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};
