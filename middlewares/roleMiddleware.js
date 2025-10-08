// middlewares/roles.js
module.exports = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    // Si no hay user o no hay rol, bloquea:
    if (!req.user || !req.user.rol) {
      return res.status(403).json({ message: "Forbidden: missing role" });
    }
    if (!allowed.includes(req.user.rol)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
