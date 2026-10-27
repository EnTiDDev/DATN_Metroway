const pool = require('../config/db');
const Schedule = require('../models/schedule.model');

async function list(req, res) {
  try {
    const rows = await Schedule.list(pool);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function search(req, res) {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ message: 'Vui lòng cung cấp ga đi và ga đến' });
    }
    const rows = await Schedule.search(pool, from, to);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getAllStations(req, res) {
  try {
    const rows = await Schedule.getAllStations(pool);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function carriagesBySchedule(req, res) {
  try {
    const rows = await Schedule.getCarriagesBySchedule(pool, req.params.id);
    const normalized = (rows || []).map(r => ({
      ...r,
      type: (() => {
        const t = String(r.type || '').toLowerCase();
        if (/giuong|giường|bed/.test(t)) return 'Giường nằm';
        if (/mềm|mem|soft/.test(t)) return 'Ghế mềm';
        if (/cứng|cung|hard/.test(t)) return 'Ghế cứng';
        return r.type;
      })()
    }));
    res.json(normalized);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function seatsByCarriage(req, res) {
  try {
    const rows = await Schedule.getSeatsByCarriageNumber(pool, req.params.number);
    const normalized = (rows || []).map(r => ({
      ...r,
      class: (() => {
        const c = String(r.class || '').toLowerCase();
        if (/hạng\s*1|hang\s*1|vip|business|thương\s*gia|thuong\s*gia/.test(c)) return 'Thương gia';
        if (/hạng\s*2|hạng\s*3|hang\s*2|hang\s*3|economy|phổ\s*thông|pho\s*thong/.test(c)) return 'Phổ thông';
        return r.class;
      })()
    }));
    res.json(normalized);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { list, search, getAllStations, carriagesBySchedule, seatsByCarriage };
