const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'salt_key_2024').digest('hex');
}

async function list(pool){
  return await pool.query('SELECT * FROM nhanvien');
}
async function create(pool, payload){
  const hashedPassword = hashPassword(payload.password);
  const sql = `INSERT INTO nhanvien (username, password, hoten, ngaysinh, diachi, dienthoai, email, cccd, adminQuanLy)
               VALUES (?,?,?,?,?,?,?,?,?)`;
  await pool.query(sql,[payload.username,hashedPassword,payload.hoten,payload.ngaysinh,payload.diachi,payload.dienthoai,payload.email,payload.cccd,payload.adminQuanLy]);
}
async function update(pool, id, payload){
  const hashedPassword = hashPassword(payload.password);
  const sql = `UPDATE nhanvien SET username=?, password=?, hoten=?, ngaysinh=?, diachi=?, dienthoai=?, email=?, cccd=?, adminQuanLy=? WHERE id=?`;
  await pool.query(sql,[payload.username,hashedPassword,payload.hoten,payload.ngaysinh,payload.diachi,payload.dienthoai,payload.email,payload.cccd,payload.adminQuanLy,id]);
}
async function remove(pool,id){
  await pool.query('DELETE FROM nhanvien WHERE id=?',[id]);
}
module.exports = { list, create, update, remove };


