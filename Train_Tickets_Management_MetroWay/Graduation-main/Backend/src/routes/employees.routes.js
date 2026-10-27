const { Router } = require('express');
const ctrl = require('../controllers/employees.controller');
const { authenticate, requireAdmin, requireStaff } = require('../middlewares/auth');

const r = Router();
r.get('/employees', authenticate, requireStaff, ctrl.list);
r.post('/add-employee', authenticate, requireAdmin, ctrl.create);
r.put('/employees/:id', authenticate, requireAdmin, ctrl.update);
r.delete('/employees/:id', authenticate, requireAdmin, ctrl.remove);

module.exports = r;


