const authGuard = (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      next();
    } else {
      return res.status(401).json({
        message: "لطفا اول نسبت به احراز هویت اقدام نمایید",
      });
    }
  } catch (e) {
    return res.json({
      message: "internal server error",
      error: e.message,
    });
  }
};

module.exports = authGuard;
