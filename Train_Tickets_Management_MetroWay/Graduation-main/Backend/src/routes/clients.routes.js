const { Router } = require('express');
const ctrl = require('../controllers/clients.controller');
const { authenticate, requireAdmin, requireStaff } = require('../middlewares/auth');

const r = Router();
r.get('/clients', authenticate, requireStaff, ctrl.list);
r.put('/clients/:id', authenticate, requireAdmin, ctrl.update);
r.delete('/clients/:id', authenticate, requireAdmin, ctrl.remove);
r.post('/add-client', authenticate, requireStaff, ctrl.create);

module.exports = r;


