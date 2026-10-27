const { Router } = require('express');
const ctrl = require('../controllers/tickets.controller');
const { authenticate, requireAdmin, requireStaff } = require('../middlewares/auth');

const r = Router();

// keep same paths as legacy server.js for compatibility
r.post('/booking', authenticate, ctrl.booking);
r.get('/tickets', ctrl.myTickets);
r.delete('/tickets/:id', authenticate, ctrl.cancel);
r.get('/admin/tickets', authenticate, requireStaff, ctrl.adminList);
r.delete('/admin/tickets/:id', authenticate, requireStaff, ctrl.adminCancel);
r.get('/booked-seats', ctrl.bookedSeats);

module.exports = r;


