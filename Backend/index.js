const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

//conexion a PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "TurnoCare",
    port: 5432,
    password: "041203",
});

//peticion para recibir datos del usuario
