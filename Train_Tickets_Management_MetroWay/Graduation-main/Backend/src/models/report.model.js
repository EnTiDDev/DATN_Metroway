async function summary(pool, from, to){
  const params = [];
  let where = '';
  if (from && to){ where = 'WHERE NgayDat BETWEEN ? AND ?'; params.push(from+' 00:00:00', to+' 23:59:59'); }
  const rows = await pool.query(`SELECT IFNULL(SUM(DonGia),0) AS revenue, COUNT(*) AS tickets FROM ve ${where}`, params);
  return rows?.[0] || { revenue:0, tickets:0 };
}
async function daily(pool, from, to){
  const params = [];
  let where = '';
  if (from && to){ where = 'WHERE NgayDat BETWEEN ? AND ?'; params.push(from+' 00:00:00', to+' 23:59:59'); }
  return await pool.query(`SELECT DATE(NgayDat) AS date, COUNT(*) AS tickets, IFNULL(SUM(DonGia),0) AS revenue FROM ve ${where} GROUP BY DATE(NgayDat) ORDER BY DATE(NgayDat)`, params);
}
async function monthly(pool){
  return await pool.query(`SELECT DATE_FORMAT(NgayDat, '%Y-%m') AS month, COUNT(*) AS tickets, IFNULL(SUM(DonGia),0) AS revenue FROM ve GROUP BY DATE_FORMAT(NgayDat, '%Y-%m') ORDER BY month`);
}
module.exports = { summary, daily, monthly };


