const express = require("express");
const debug = require("debug")("app:main");
const app = express();
const { config } = require("./config");
const { ProductsAPI } = require("./products/index");
const { UsersAPI } = require ('./users/index');
const { SalesAPI } = require("./sales");
const {IndexAPI, NotFoundAPI} = require('./index/index')

// Esto es un middleware, se ejecuta antes de las rutas, y se encarga de parsear el body de las peticiones a JSON
// , para que podamos acceder a los datos enviados en el body de las peticiones a través de req.body
app.use(express.json());

/*===== MODULOS ===== 
! Para indexAPI y NotFoundAPI el orden es importante !*/
IndexAPI(app);
UsersAPI(app);
ProductsAPI(app);
SalesAPI(app);
NotFoundAPI(app)

app.listen(config.port, () => {
  debug(`Servidor escuchando en el puerto ${config.port}`);
});
