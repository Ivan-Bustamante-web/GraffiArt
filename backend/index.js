require('dotenv').config();
const express = require('express');
const cors = require('cors');
const materialRoutes = require('./src/routes/material.routes');
const authRoutes = require('./src/routes/auth.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');
const disenoRoutes = require('./src/routes/diseno.routes');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API GraffiArt funcionando' });
});

app.use('/api/materiales', materialRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/disenos', disenoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

