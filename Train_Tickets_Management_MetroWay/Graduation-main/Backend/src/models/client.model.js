async function list(pool){ return await pool.query('SELECT * FROM hanhkhach'); }
async function update(pool,id,payload){
  const sql = `UPDATE hanhkhach SET cccd=?, hoten=?, ngaysinh=?, diachi=?, dienthoai=?, email=? WHERE makh=?`;
  const phone = String(payload.DienThoai || '').replace(/^\+84/, '0');
  await pool.query(sql,[payload.CCCD,payload.HoTen,payload.ngaysinh,payload.DiaChi,phone,payload.Email,id]);
}
async function remove(pool,id){ await pool.query('DELETE FROM hanhkhach WHERE makh=?',[id]); }
async function create(pool,payload){
  const sql = 'INSERT INTO hanhkhach (CCCD, HoTen, ngaysinh, DiaChi, DienThoai, Email, Password) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const phone = String(payload.dienthoai || '').replace(/^\+84/, '0');
  const crypto = require('crypto');
  const pwd = String(payload.password || '');
  const hashed = crypto.createHash('sha256').update(pwd + 'salt_key_2024').digest('hex');
  await pool.query(sql,[payload.cccd,payload.hoten,payload.ngaysinh,payload.diachi,phone,payload.email,hashed]);
}
module.exports = { list, update, remove, create };


