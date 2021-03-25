const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const expressValidator = require('express-validator');
const responseHandler = require('./responseHandler');
const routes = require('./routes');
const app = express();
const path = require('path');

// allow Cross-Origin requests
app.use(cors());

// limit request from the same API 
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({
    limit: '15kb'
}));

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(expressValidator());

// routes
app.use('/api/v1', routes);

// handle undefined routes
app.use('*', (request, response, next) => {
    responseHandler.errorResponse(response, 404, 'Not found');
});

module.exports = app;