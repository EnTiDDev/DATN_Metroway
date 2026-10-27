const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');

const r = Router();
r.post('/login', ctrl.login);
r.post('/register', ctrl.register);
r.get('/login', (req, res) => res.send('Login page'));
r.get('/register', (req, res) => res.send('Register page'));

module.exports = r;


