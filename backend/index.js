require('dotenv').config();
const express = require('express');
const cors = require('cors');
const materialRoutes = require('./src/routes/material.routes');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/materiales', materialRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
