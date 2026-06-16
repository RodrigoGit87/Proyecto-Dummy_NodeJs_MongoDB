// ESte modulo debe permitir hacer ventas de los productos existentes y
//por cada venta, almacenar el registro de esa venta (producto,cantidad y q usuario compró).


const express = require("express");
const { SalesController } = require("./controller");
const router = express.Router();

module.exports.SalesAPI = (app) => {
  router
    .get("/", SalesController.getSales) 
    .get("/:id", SalesController.getSale) 
    .post("/", SalesController.registerSale)
    .put("/:id", SalesController.updateSale)
    .delete("/:id", SalesController.deleteSale);

  app.use("/api/sales", router);
};