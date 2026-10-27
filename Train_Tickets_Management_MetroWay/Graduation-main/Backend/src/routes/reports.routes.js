const { Router } = require('express');
const ctrl = require('../controllers/reports.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');
const r = Router();
r.get('/reports/summary', authenticate, requireAdmin, ctrl.summary);
r.get('/reports/daily', authenticate, requireAdmin, ctrl.daily);
r.get('/reports/monthly', authenticate, requireAdmin, ctrl.monthly);
module.exports = r;


