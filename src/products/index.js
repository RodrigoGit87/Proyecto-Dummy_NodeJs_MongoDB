const express = require("express");
const { ProductsController } = require("./controller");
const router = express.Router();

module.exports.ProductsAPI = (app) => {
  router
    .get("/", ProductsController.getProducts) //http://localhost:PORT/api/products/
    .get("/report", ProductsController.generateReport)
    .get("/:id", ProductsController.getProduct) //http://localhost:PORT/api/products/67
    .post("/", ProductsController.createProduct)
    .post("/register_many", ProductsController.createProductsMany)
    .put("/:id", ProductsController.updateProduct)
    .delete("/:id", ProductsController.deleteProduct);


  app.use("/api/products", router);
};

// Para testear el createProduct en postman, hacer una peticion tipo post en:
// http://localhost:3000/api/products y en la seccion body, clicar en radio 'raw' y elegir
//JSON como formato.

// En el input text, abrimos llaves y definimos los clave:valor q queramos probar.
//Por ejemplo:
/*
{
    "name": "camisetas",
    "price": 15,
    "stock": 200
} 
    */

//Si damos SEND y retorna status 200 OK, pero no vemos nada, hacer un get del mismo path
