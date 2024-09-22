const express = require("express");
const app = express();
const bodyParser = require('body-parser')
require('dotenv').config()
const Pool = require('pg').Pool
//const connectionString = process.env.DB

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

const getUsuario = (request, response) => {
  pool.query('SELECT * FROM usuarios ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const crearUsuario = (request, response) => {
  const { nombre, edad, tipo } = request.body

  console.log("Nombre:", nombre, "edad:", edad, "tipo:", tipo)
  pool.query('insert into usuarios (nombre,edad,tipo) values ($1, $2, $3)', [nombre, edad, tipo], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({ UsuarioAgregado: 'Ok' })
  })
}

const actualizarUsuario = (request, response) => {
  const id = parseInt(request.params.id);
  const { nombre, edad, tipo } = request.body;

  pool.query(
    'UPDATE usuarios SET nombre = $1, edad = $2, tipo = $3 WHERE id = $4',
    [nombre, edad, tipo, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json({ UsuarioActualizado: 'Ok' });
    }
  );
};

const eliminarUsuario = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM usuarios WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(204).send();
  });
};

app.get('/', function (req, res) {
  res.json({ Resultado: 'Bienvenido al Taller Despliegue Rest' })
});

app.get('/usuarios', getUsuario);
app.post('/usuarios', crearUsuario);
app.put('/usuarios/:id', actualizarUsuario);
app.delete('/usuarios/:id', eliminarUsuario);

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log("El servidor está inicializado en http://localhost:%d", port);
});