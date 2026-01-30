const express = require('express');
const routes = require('./routes');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middlewares/error.middleware');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.options('*', cors());
app.use(express.json());
app.use('/api', routes);
// Swagger route (enable only when SHOW_API_DOCS=true)
if (process.env.SHOW_API_DOCS === 'true') {
  try {
    const basicAuth = require('express-basic-auth');
    app.use('/api/docs', basicAuth({ users: { admin: process.env.SWAGGER_PASSWORD || 'admin' }, challenge: true }), swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  } catch (err) {
    // express-basic-auth is optional; fall back to unprotected docs if not installed
    app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  }
}
app.use(errorHandler);

module.exports = app;
