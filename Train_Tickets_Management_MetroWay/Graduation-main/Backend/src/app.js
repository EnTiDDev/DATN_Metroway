const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/', require('./routes/auth.routes'));
app.use('/', require('./routes/tickets.routes'));
app.use('/', require('./routes/employees.routes'));
app.use('/', require('./routes/clients.routes'));
app.use('/', require('./routes/schedules.routes'));
app.use('/', require('./routes/reports.routes'));
app.use('/', require('./routes/catalog.routes'));
// TODO: mount other routes similarly (auth, employees, clients, schedules, reports, catalog)

module.exports = app;


