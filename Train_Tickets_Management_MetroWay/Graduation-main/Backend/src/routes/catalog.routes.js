const { Router } = require('express');
const c = require('../controllers/catalog.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');
const r = Router();

// Trains
r.get('/catalog/trains', authenticate, requireAdmin, c.listTrains);
r.post('/catalog/trains', authenticate, requireAdmin, c.createTrain);
r.put('/catalog/trains/:id', authenticate, requireAdmin, c.updateTrain);
r.delete('/catalog/trains/:id', authenticate, requireAdmin, c.deleteTrain);

// Carriages
r.get('/catalog/carriages', authenticate, requireAdmin, c.listCarriages);
r.post('/catalog/carriages', authenticate, requireAdmin, c.createCarriage);
r.put('/catalog/carriages/:id', authenticate, requireAdmin, c.updateCarriage);
r.delete('/catalog/carriages/:id', authenticate, requireAdmin, c.deleteCarriage);

// Seats
r.get('/catalog/seats', authenticate, requireAdmin, c.listSeats);
r.post('/catalog/seats', authenticate, requireAdmin, c.createSeat);
r.put('/catalog/seats/:id', authenticate, requireAdmin, c.updateSeat);
r.delete('/catalog/seats/:id', authenticate, requireAdmin, c.deleteSeat);

// Routes
r.get('/catalog/routes', authenticate, requireAdmin, c.listRoutes);
r.post('/catalog/routes', authenticate, requireAdmin, c.createRoute);
r.put('/catalog/routes/:id', authenticate, requireAdmin, c.updateRoute);
r.delete('/catalog/routes/:id', authenticate, requireAdmin, c.deleteRoute);

// Prices
r.get('/catalog/prices', authenticate, requireAdmin, c.listPrices);
r.post('/catalog/prices', authenticate, requireAdmin, c.createPrice);
r.put('/catalog/prices/:id', authenticate, requireAdmin, c.updatePrice);
r.delete('/catalog/prices/:id', authenticate, requireAdmin, c.deletePrice);

module.exports = r;


