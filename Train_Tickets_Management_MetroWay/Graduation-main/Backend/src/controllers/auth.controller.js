const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../config/db");
const SECRET_KEY = process.env.JWT_SECRET || "Tung-Duong";

function generateToken(role) {
  return jwt.sign({ role }, SECRET_KEY, { expiresIn: "1h" });
}

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(String(password) + "salt_key_2024")
    .digest("hex");
}

async function login(req, res) {
  try {
    let { username, password } = req.body;
    username = String(username || "").trim();
    password = String(password || "");
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin đăng nhập" });

    const hashed1 = hashPassword(password);
    const hashed2 = hashPassword(hashed1); // handle accidental double-hash

    // Admin login (username)
    const adminQuery =
      "SELECT HoTen FROM admin WHERE Username = ? AND Password IN (?, ?, ?)";
    const adminRows = await pool.query(adminQuery, [
      username,
      hashed1,
      password,
      hashed2,
    ]);
    if (adminRows.length > 0) {
      const hoten = adminRows[0].HoTen;
      return res.json({
        success: true,
        role: "admin",
        hoten,
        token: generateToken("admin"),
      });
    }

    // Passenger login (phone OR email)
    const passengerQuery =
      "SELECT MaKH, HoTen FROM hanhkhach WHERE (DienThoai = ? OR Email = ?) AND Password IN (?, ?, ?)";
    const normalizedUser = username.replace(/^\+84/, "0");
    const pRows = await pool.query(passengerQuery, [
      normalizedUser,
      normalizedUser,
      hashed1,
      password,
      hashed2,
    ]);
    if (pRows.length > 0) {
      const { HoTen: hoten, MaKH: maKh } = pRows[0];
      return res.json({
        success: true,
        role: "hanhkhach",
        hoten,
        maKh,
        token: generateToken("hanhkhach"),
      });
    }

    // Employee login (username)
    const employeeQuery =
      "SELECT hoten FROM nhanvien WHERE username = ? AND password IN (?, ?, ?)";
    const eRows = await pool.query(employeeQuery, [
      username,
      hashed1,
      password,
      hashed2,
    ]);
    if (eRows.length > 0) {
      const hoten = eRows[0].hoten;
      return res.json({
        success: true,
        role: "employee",
        hoten,
        token: generateToken("employee"),
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Thông tin đăng nhập không chính xác" });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
}

async function register(req, res) {
  try {
    const { cccd, password, hoten, ngaysinh, diachi, dienthoai, email } =
      req.body;
    const hashedPassword = hashPassword(password);
    const sql =
      "INSERT INTO hanhkhach ( cccd, password, hoten, ngaysinh, diachi, dienthoai, email) VALUES ( ?, ?, ?, ?, ?, ?, ?)";
    await pool.query(sql, [
      cccd,
      hashedPassword,
      hoten,
      ngaysinh,
      diachi,
      dienthoai,
      email,
    ]);
    res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (e) {
    console.error("Register error:", e);
    if (e.code === "ER_DUP_ENTRY") {
      res.status(400).json({
        success: false,
        message: "CCCD, email hoặc số điện thoại đã tồn tại!",
      });
    } else {
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }
}

module.exports = { login, register };
