async function list(pool, table){ return await pool.query(`SELECT * FROM ${table}`); }
async function createTrain(pool, body){ const r = await pool.query('INSERT INTO doantau (code,name) VALUES (?,?)',[body.code, body.name]); return { id:r.insertId, ...body } }
async function updateTrain(pool, id, body){ await pool.query('UPDATE doantau SET code=?, name=? WHERE id=?',[body.code, body.name, id]); return { id:Number(id), ...body } }
async function deleteTrain(pool, id){ await pool.query('DELETE FROM doantau WHERE id=?',[id]); return true }

async function createCarriage(pool, body){ const r=await pool.query('INSERT INTO toatau (trainCode,number,type) VALUES (?,?,?)',[body.trainCode, body.number, body.type]); return { id:r.insertId, ...body } }
async function updateCarriage(pool, id, body){ await pool.query('UPDATE toatau SET trainCode=?, number=?, type=? WHERE id=?',[body.trainCode, body.number, body.type, id]); return { id:Number(id), ...body } }
async function deleteCarriage(pool, id){ await pool.query('DELETE FROM toatau WHERE id=?',[id]); return true }

async function createSeat(pool, body){ const r=await pool.query('INSERT INTO ghe (carriage, code, class, status) VALUES (?,?,?,?)',[body.carriage, body.code, body.class, body.status]); return { id:r.insertId, ...body } }
async function updateSeat(pool, id, body){ await pool.query('UPDATE ghe SET carriage=?, code=?, class=?, status=? WHERE id=?',[body.carriage,body.code,body.class,body.status,id]); return { id:Number(id), ...body } }
async function deleteSeat(pool, id){ await pool.query('DELETE FROM ghe WHERE id=?',[id]); return true }

async function createRoute(pool, body){ const r=await pool.query('INSERT INTO tuyen (code, `from`, `to`, distance) VALUES (?,?,?,?)',[body.code,body.from,body.to,body.distance]); return { id:r.insertId, ...body } }
async function updateRoute(pool, id, body){ await pool.query('UPDATE tuyen SET code=?, `from`=?, `to`=?, distance=? WHERE id=?',[body.code,body.from,body.to,body.distance,id]); return { id:Number(id), ...body } }
async function deleteRoute(pool, id){ await pool.query('DELETE FROM tuyen WHERE id=?',[id]); return true }

async function createPrice(pool, body){ const r=await pool.query('INSERT INTO banggia (routeCode, class, amount) VALUES (?,?,?)',[body.routeCode, body.class, body.amount]); return { id:r.insertId, ...body } }
async function updatePrice(pool, id, body){ await pool.query('UPDATE banggia SET routeCode=?, class=?, amount=? WHERE id=?',[body.routeCode, body.class, body.amount, id]); return { id:Number(id), ...body } }
async function deletePrice(pool, id){ await pool.query('DELETE FROM banggia WHERE id=?',[id]); return true }

module.exports = { list, createTrain, updateTrain, deleteTrain, createCarriage, updateCarriage, deleteCarriage, createSeat, updateSeat, deleteSeat, createRoute, updateRoute, deleteRoute, createPrice, updatePrice, deletePrice };


