const pool = require('../config/db');
const Rep = require('../models/report.model');

async function summary(req,res){ try{ const r = await Rep.summary(pool, req.query.from, req.query.to); res.json(r);}catch(e){res.status(500).json({error:e.message})} }
async function daily(req,res){ try{ const r = await Rep.daily(pool, req.query.from, req.query.to); res.json(r);}catch(e){res.status(500).json({error:e.message})} }
async function monthly(req,res){ try{ const r = await Rep.monthly(pool); res.json(r);}catch(e){res.status(500).json({error:e.message})} }

module.exports = { summary, daily, monthly };


