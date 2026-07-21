const userModel = require("./../modules/user/auth/userModel");

const isUser = async (req, res, next) => {
  try {
    const userId = req.session.user;
    const user = await userModel.findOne({ _id: userId });
    if (user.role === "user") {
      req.user = user
      next();
    } else {
      return res.status(403).json({
        message: "شما نمیتوانید به این صفحه وارد شوید",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

module.exports = isUser;
