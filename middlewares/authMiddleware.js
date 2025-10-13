// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  // ✅ Modo DEV: si está activado, injecta un usuario fake y deja pasar
  const devOn = String(process.env.AUTH_DEV_FAKE || "0") === "1";
  if (devOn) {
    req.user = {
      id: Number(process.env.FAKE_USER_ID || 1),
      role: process.env.FAKE_USER_ROLE || "admin",
    };
    return next();
  }

  // ✅ Modo real con JWT en Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
