const pool = require('../config/db');
const Sch = require('../models/schedule.model');

async function list(req,res){ try{ const rows = await Sch.list(pool); res.json(rows);}catch(e){res.status(500).json({error:e.message})} }
async function search(req,res){ try{ const rows = await Sch.search(pool, req.query.from, req.query.to); res.json(rows);}catch(e){res.status(500).json({error:e.message})} }
async function getAllStations(req,res){ try{ const rows = await Sch.getAllStations(pool); res.json(rows);}catch(e){res.status(500).json({error:e.message})} }

module.exports = { list, search, getAllStations };


