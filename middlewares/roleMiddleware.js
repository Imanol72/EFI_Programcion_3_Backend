// backend/middlewares/roleMiddleware.js
module.exports = function roleMiddleware(allowed = []) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!allowed.length || allowed.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  };
};
