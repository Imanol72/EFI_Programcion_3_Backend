// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./models');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// healthcheck para probar rápido
app.get('/api/auth/health', (req, res) => res.json({ ok: true }));

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/rooms', require('./routes/rooms.routes'));
app.use('/api/clients', require('./routes/clients.routes'));
app.use('/api/reservations', require('./routes/reservations.routes'));

const PORT = process.env.PORT || 3000;

db.sequelize.sync()
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error('❌ Error al sincronizar DB:', err));

// Handler global
app.use((err, req, res, next) => {
  console.error('🔥 Uncaught error:', err);
  res.status(500).json({ message: err?.message || 'Internal Server Error' });
});
