const express = require("express");
const createError = require("http-errors");
const { Response } = require("../common/response");

module.exports.IndexAPI = (app) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    // Cuando se entre a la ruta principal con exito, enseñamos un 'menu' con las URL del proyecto
    // 'req.headers.host' sirve para obtener el host de nuestro proyecto cuando esté en internet, atraves
    // de algun proveedor de servicios en la nube (como Heroku)
    const menu = {
      products: `https://${req.headers.host}/api/products`,
      users: `https://${req.headers.host}/api/users`,
      sales: `https://${req.headers.host}/api/sales`,
    };
    Response.success(res, 200, "API Dummy", menu);
  });

  app.use("/", router);
};

module.exports.NotFoundAPI = (app) => {
  const router = express.Router();
  //.use() -> cualquier peticion q no este definida en mi app, será respondida con este
  // notFound error
  router.use((request, response) => {
    Response.error(response, new createError.NotFound());
  });

  app.use("/", router);
};
