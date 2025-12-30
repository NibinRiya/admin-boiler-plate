const express = require('express');
const routes = require('./routes');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use('/api', routes);
// Swagger route
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(errorHandler);

module.exports = app;
