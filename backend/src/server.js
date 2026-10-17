// PUNTO DE ENTRADA
// Es lo primero que se ejecuta: conecta con la base de datos y pone en marcha el servidor.
// También cierra todo de forma ordenada cuando se apaga el programa.

import env from './config/env.js';
import app from './app.js';
import prisma from './lib/prisma.js';
import { MESSAGES } from './constants/messages.js';

const start = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error(MESSAGES.server.dbError, error.message);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(MESSAGES.server.running(env.PORT));
  });

  const shutdown = () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

start();
