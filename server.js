require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.post('/api/hospital', (req, res) => {
  const { nombre, direccion, telefono } = req.body;
  db.query(
    'INSERT INTO Hospital (nombre, direccion, telefono) VALUES (?, ?, ?)',
    [nombre, direccion, telefono],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: '¡Información registrada correctamente!' });
    }
  );
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Servidor backend corriendo en puerto ${process.env.PORT || 3001}`);
});
