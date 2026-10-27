const { Router } = require('express');
const ctrl = require('../controllers/schedule.controller');
const r = Router();
r.get('/schedules', ctrl.list);
r.get('/schedules/search', ctrl.search);
r.get('/schedules/stations', ctrl.getAllStations);
// new endpoints to support dynamic booking catalog
r.get('/schedules/:id/carriages', ctrl.carriagesBySchedule);
r.get('/carriages/:number/seats', ctrl.seatsByCarriage);
module.exports = r;


