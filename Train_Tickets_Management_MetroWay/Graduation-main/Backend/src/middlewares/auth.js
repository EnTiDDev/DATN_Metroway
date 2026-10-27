const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "Tung-Duong";

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Access denied" });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, message: "Invalid token" });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
}

function requireStaff(req, res, next) {
  const role = req.user?.role;
  if (role === "admin" || role === "employee") return next();
  return res.status(403).json({ message: "Staff only" });
}

module.exports = { authenticate, requireAdmin, requireStaff };
