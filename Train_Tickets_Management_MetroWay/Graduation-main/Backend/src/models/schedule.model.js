async function list(pool){ return await pool.query('SELECT * FROM lichtrinh'); }
async function search(pool, from, to){ return await pool.query('SELECT * FROM lichtrinh WHERE GaDi = ? AND GaDen = ?', [from, to]); }
async function getAllStations(pool){ 
  const sql = `SELECT DISTINCT GaDi as station FROM lichtrinh 
               UNION 
               SELECT DISTINCT GaDen as station FROM lichtrinh 
               ORDER BY station`;
  return await pool.query(sql);
}
async function getById(pool, id){
  const rows = await pool.query('SELECT * FROM lichtrinh WHERE MaLichTrinh = ?', [id]);
  return rows && rows.length ? rows[0] : null;
}

// Return carriages of the train used in a schedule (by schedule id)
async function getCarriagesBySchedule(pool, scheduleId){
  const sql = `
    SELECT t.id, t.number, t.type, t.trainCode
    FROM lichtrinh l
    JOIN doantau d ON (d.name = l.TenTau OR d.code = l.TenTau)
    JOIN toatau t ON t.trainCode = d.code
    WHERE l.MaLichTrinh = ?
    ORDER BY CAST(t.number AS UNSIGNED), t.number`;
  const rows = await pool.query(sql, [scheduleId]);
  if (rows && rows.length) return rows;
  // Auto-provision default carriages if none exist for this schedule's train
  const train = await pool.query(
    'SELECT d.code AS trainCode FROM lichtrinh l JOIN doantau d ON (d.name = l.TenTau OR d.code = l.TenTau) WHERE l.MaLichTrinh = ? LIMIT 1',
    [scheduleId]
  );
  const trainCode = train && train[0] && train[0].trainCode;
  if (!trainCode) return [];
  const defaults = [
    { number: '1', type: 'Giường nằm' },
    { number: '2', type: 'Ghế mềm' },
    { number: '3', type: 'Ghế cứng' },
  ];
  for (const c of defaults) {
    await pool.query('INSERT INTO toatau (trainCode, number, type) VALUES (?,?,?)', [trainCode, c.number, c.type]);
  }
  return await pool.query(sql, [scheduleId]);
}

// Return seats in a carriage (by carriage number)
async function getSeatsByCarriageNumber(pool, carriageNumber){
  const sql = 'SELECT id, code, class, status FROM ghe WHERE carriage = ? ORDER BY code';
  const rows = await pool.query(sql, [carriageNumber]);
  if (rows && rows.length) return rows;
  // Auto-provision default seats with classes when empty
  const letters = ['A','B','C','D','E'];
  const cols = 6;
  const seatsToInsert = [];
  for (let r = 0; r < letters.length; r++) {
    const rowLetter = letters[r];
    const seatClass = r === 0 ? 'Thương gia' : 'Phổ thông';
    for (let c = 1; c <= cols; c++) {
      const code = rowLetter + String(c);
      seatsToInsert.push([carriageNumber, code, seatClass, 'AVAILABLE']);
    }
  }
  for (const tuple of seatsToInsert) {
    await pool.query('INSERT INTO ghe (carriage, code, class, status) VALUES (?,?,?,?)', tuple);
  }
  return await pool.query(sql, [carriageNumber]);
}

module.exports = { list, search, getAllStations, getById, getCarriagesBySchedule, getSeatsByCarriageNumber };


