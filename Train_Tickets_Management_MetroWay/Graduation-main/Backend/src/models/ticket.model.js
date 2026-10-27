async function create(pool, payload) {
  const sql = `INSERT INTO ve (Toa, SoGhe, LoaiVe, NgayDi, GioDi, LichTrinh, DonGia, NgayDat, PhuongThucThanhToan, MaKH)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const args = [
    payload.carriage,
    payload.seat,
    payload.ticketType,
    payload.departureDate,
    payload.time,
    payload.route,
    payload.price * payload.quantity,
    new Date(),
    payload.paymentMethod,
    payload.maKh || null,
  ];
  const result = await pool.query(sql, args);
  return { insertId: result.insertId };
}

async function createSingle(pool, payload, seatCode) {
  const sql = `INSERT INTO ve (Toa, SoGhe, LoaiVe, NgayDi, GioDi, LichTrinh, DonGia, NgayDat, PhuongThucThanhToan, MaKH)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const args = [
    payload.carriage,
    seatCode,
    payload.ticketType,
    payload.departureDate,
    payload.time,
    payload.route,
    payload.price,
    new Date(),
    payload.paymentMethod,
    payload.maKh || null,
  ];
  const result = await pool.query(sql, args);
  return { insertId: result.insertId };
}

async function listByCustomer(pool, maKh) {
  const sql = `SELECT v.*, l.GaDi, l.GaDen, l.NgayDen, l.TenTau, g.class AS HangGhe
               FROM ve v
               LEFT JOIN lichtrinh l ON v.LichTrinh = l.MaLichTrinh
               LEFT JOIN ghe g ON g.carriage = v.Toa AND g.code = v.SoGhe
               WHERE v.MaKH = ?
               ORDER BY v.NgayDat DESC`;
  return await pool.query(sql, [maKh]);
}

async function listAll(pool) {
  const sql = `SELECT v.*, h.HoTen, h.CCCD, l.GaDi, l.GaDen, l.NgayDen, l.TenTau, g.class AS HangGhe
               FROM ve v 
               LEFT JOIN hanhkhach h ON v.MaKH = h.MaKH
               LEFT JOIN lichtrinh l ON v.LichTrinh = l.MaLichTrinh
               LEFT JOIN ghe g ON g.carriage = v.Toa AND g.code = v.SoGhe
               ORDER BY v.NgayDat DESC`;
  return await pool.query(sql);
}

async function deleteIfCash(pool, id) {
  const rows = await pool.query('SELECT PhuongThucThanhToan FROM ve WHERE MaVe = ?', [id]);
  if (!rows || rows.length === 0) throw new Error('Không tìm thấy vé');
  if ((rows[0].PhuongThucThanhToan || '').toUpperCase() === 'VNPAY') throw new Error('Vé thanh toán online không thể hủy');
  await pool.query('DELETE FROM ve WHERE MaVe = ?', [id]);
  return true;
}

async function deleteByAdmin(pool, id) {
  const rows = await pool.query('SELECT PhuongThucThanhToan FROM ve WHERE MaVe = ?', [id]);
  if (!rows || rows.length === 0) throw new Error('Không tìm thấy vé');
  await pool.query('DELETE FROM ve WHERE MaVe = ?', [id]);
  return true;
}

module.exports = { create, createSingle, listByCustomer, listAll, deleteIfCash, deleteByAdmin };

async function listBookedSeats(pool, filters){
  const { route, departureDate, time, carriage } = filters;
  const conds = [];
  const args = [];
  if (route){ conds.push('LichTrinh = ?'); args.push(route); }
  if (departureDate){ conds.push('NgayDi = ?'); args.push(departureDate); }
  if (time){ conds.push('GioDi = ?'); args.push(time); }
  if (carriage){ conds.push('Toa = ?'); args.push(carriage); }
  const where = conds.length ? ('WHERE ' + conds.join(' AND ')) : '';
  const rows = await pool.query(`SELECT Toa, SoGhe FROM ve ${where}`, args);
  return rows;
}

module.exports.listBookedSeats = listBookedSeats;


