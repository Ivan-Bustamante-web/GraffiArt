// ARMADO DE LA APP
// Arma la aplicación: activa CORS, la lectura de JSON, las rutas y el manejo de errores.
// No levanta el servidor (eso lo hace server.js), así se puede reutilizar y probar.

import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { MESSAGES } from './constants/messages.js';
import { API_PREFIX } from './constants/config.js';

const app = express();

app.use(cors({ origin: env.isProduction ? env.FRONTEND_URL : true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: MESSAGES.server.health });
});

app.use(API_PREFIX, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
