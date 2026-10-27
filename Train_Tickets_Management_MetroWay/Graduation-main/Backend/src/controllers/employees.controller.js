const pool = require('../config/db');
const Emp = require('../models/employee.model');

async function list(req,res){
  try{ const rows = await Emp.list(pool); res.json(rows);}catch(e){res.status(500).json({error:e.message})}
}
async function create(req,res){
  try{
    const b = req.body || {};
    const errors = {};
    if(!b.username || String(b.username).length < 4) errors.username = 'Username tối thiểu 4 ký tự';
    if(!b.password || String(b.password).length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự';
    if(!b.hoten) errors.hoten = 'Họ tên là bắt buộc';
    if(!b.ngaysinh) errors.ngaysinh = 'Ngày sinh là bắt buộc';
    if(!b.diachi) errors.diachi = 'Địa chỉ là bắt buộc';
    if(!b.dienthoai) errors.dienthoai = 'Điện thoại là bắt buộc';
    if(b.dienthoai && !/^(\+84|0)\d{9,10}$/.test(String(b.dienthoai))) errors.dienthoai = 'Số điện thoại không hợp lệ';
    if(!b.email) errors.email = 'Email là bắt buộc';
    if(b.email){ const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(b.email)); if(!ok) errors.email = 'Email không hợp lệ'; }
    if(!b.cccd || !/^\d{9,12}$/.test(String(b.cccd))) errors.cccd = 'CCCD không hợp lệ';
    if(Object.keys(errors).length) return res.status(400).json({ success:false, message:'Dữ liệu không hợp lệ', errors });

    // Normalize phone: +84xxxxxxxxx -> 0xxxxxxxxx
    if (b.dienthoai) {
      b.dienthoai = String(b.dienthoai).replace(/^\+84/, '0');
    }

    // Pre-check duplicate phone/email for clearer field messages
    const checks = [];
    if (b.email) checks.push(pool.query('SELECT id FROM nhanvien WHERE email=? LIMIT 1', [b.email]).then(rows => ({ key:'email', exists: rows && rows.length>0 })));
    if (b.dienthoai) checks.push(pool.query('SELECT id FROM nhanvien WHERE REPLACE(dienthoai, "+84", "0") = ? LIMIT 1', [b.dienthoai]).then(rows => ({ key:'dienthoai', exists: rows && rows.length>0 })));
    const results = await Promise.all(checks);
    const dupErrors = {};
    for (const r of results) { if (r.exists) dupErrors[r.key] = (r.key === 'email') ? 'Email đã tồn tại' : 'Số điện thoại đã tồn tại'; }
    if (Object.keys(dupErrors).length) return res.status(409).json({ success:false, message:'Trùng dữ liệu', errors: dupErrors });

    await Emp.create(pool, b);
    res.json({success:true,message:'Nhân viên đã được thêm thành công!'});
  }catch(e){
    if(e && (e.code === 'ER_DUP_ENTRY' || e.errno === 1062)){
      const m = String(e.sqlMessage || '').toLowerCase();
      const errors = {};
      if(m.includes('username')) errors.username = 'Username đã tồn tại';
      if(m.includes('email')) errors.email = 'Email đã tồn tại';
      if(m.includes('cccd')) errors.cccd = 'CCCD đã tồn tại';
      return res.status(409).json({ success:false, message:'Trùng dữ liệu', errors });
    }
    res.status(500).json({success:false,message:e.message});
  }
}
async function update(req,res){
  try{ await Emp.update(pool, req.params.id, req.body); res.json({message:'Cập nhật thông tin nhân viên thành công!'});}catch(e){res.status(500).json({error:e.message})}
}
async function remove(req,res){
  try{ await Emp.remove(pool, req.params.id); res.json({message:'Xóa nhân viên thành công!'}) }catch(e){res.status(500).json({error:e.message})}
}

module.exports = { list, create, update, remove };


