const pool = require('../config/db');
const Cat = require('../models/catalog.model');

async function listTrains(req,res){ try{ res.json(await Cat.list(pool,'doantau')); }catch(e){ res.status(500).json({error:e.message}) } }
async function createTrain(req,res){ try{ res.json(await Cat.createTrain(pool, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function updateTrain(req,res){ try{ res.json(await Cat.updateTrain(pool, req.params.id, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function deleteTrain(req,res){ try{ await Cat.deleteTrain(pool, req.params.id); res.json({success:true}); }catch(e){ res.status(500).json({error:e.message}) } }

async function listCarriages(req,res){ try{ res.json(await Cat.list(pool,'toatau')); }catch(e){ res.status(500).json({error:e.message}) } }
async function createCarriage(req,res){ try{ res.json(await Cat.createCarriage(pool, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function updateCarriage(req,res){ try{ res.json(await Cat.updateCarriage(pool, req.params.id, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function deleteCarriage(req,res){ try{ await Cat.deleteCarriage(pool, req.params.id); res.json({success:true}); }catch(e){ res.status(500).json({error:e.message}) } }

async function listSeats(req,res){ try{ res.json(await Cat.list(pool,'ghe')); }catch(e){ res.status(500).json({error:e.message}) } }
async function createSeat(req,res){ try{ res.json(await Cat.createSeat(pool, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function updateSeat(req,res){ try{ res.json(await Cat.updateSeat(pool, req.params.id, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function deleteSeat(req,res){ try{ await Cat.deleteSeat(pool, req.params.id); res.json({success:true}); }catch(e){ res.status(500).json({error:e.message}) } }

async function listRoutes(req,res){ try{ res.json(await Cat.list(pool,'tuyen')); }catch(e){ res.status(500).json({error:e.message}) } }
async function createRoute(req,res){ try{ res.json(await Cat.createRoute(pool, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function updateRoute(req,res){ try{ res.json(await Cat.updateRoute(pool, req.params.id, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function deleteRoute(req,res){ try{ await Cat.deleteRoute(pool, req.params.id); res.json({success:true}); }catch(e){ res.status(500).json({error:e.message}) } }

async function listPrices(req,res){ try{ res.json(await Cat.list(pool,'banggia')); }catch(e){ res.status(500).json({error:e.message}) } }
async function createPrice(req,res){ try{ res.json(await Cat.createPrice(pool, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function updatePrice(req,res){ try{ res.json(await Cat.updatePrice(pool, req.params.id, req.body)); }catch(e){ res.status(500).json({error:e.message}) } }
async function deletePrice(req,res){ try{ await Cat.deletePrice(pool, req.params.id); res.json({success:true}); }catch(e){ res.status(500).json({error:e.message}) } }

module.exports = { listTrains, createTrain, updateTrain, deleteTrain, listCarriages, createCarriage, updateCarriage, deleteCarriage, listSeats, createSeat, updateSeat, deleteSeat, listRoutes, createRoute, updateRoute, deleteRoute, listPrices, createPrice, updatePrice, deletePrice };


