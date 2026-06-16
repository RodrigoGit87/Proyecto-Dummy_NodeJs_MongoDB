const { request, response } = require("express");
/*======================
Este modulo controller se encargará de la respuestas de los metodos get y post del archivo index del
modulo products

1.lo hacemos exportable -> module.exports
2.Agregamos un nombre de propiedad -> module.exports.ProductsController
3. Va a retornar un objeto -> ' {...} '
4. Como clave (key) poner el nombre de la funcion controladora -> getProducts:
5. y como  valor (value) la función controladora.-> getProducts: (request,response) => {...},
6. importamos el modulo en el index de products
-> en src/products/index.js -> const { ProductsController } = require('./controller');
7. Ahora podemos usar el modulo de 'ProductsController' en los metodos get y post del
index de products
=========================*/

//Importamos el modulo de servicios para usar sus funciones en los controladores
const { ProductsService } = require("./services");
const debug = require("debug")("app:module-products-controller");
// Importamos el module de 'response' estandarizado
const { Response } = require("../common/response");
const createError = require("http-errors");

module.exports.ProductsController = {
  getProducts: async (request, response) => {
    try {
      let products = await ProductsService.getAll();
      Response.success(response, 200, "Lista de productos", products);
    } catch (error) {
      debug(error);
      Response.error(response);
    }
  },

  getProduct: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;

      let product = await ProductsService.getById(id);
      if (!product) {
        Response.error(res, new createError.NotFound());
      } else Response.success(res, 200, `Producto ${id}`, product);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  createProduct: async (req, res) => {
    try {
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        return Response.error(res, new createError.BadRequest());
      } 

      const allowedKeys = ["name", "price", "stock"];
      const productKeys = Object.keys(body);
      const hasExtraKeys = productKeys.some( key => !allowedKeys.includes(key));
      const hasAllRequired = allowedKeys.every(key => productKeys.includes(key));

      if(hasExtraKeys || !hasAllRequired) {
        return Response.error(res, new createError.BadRequest(`Estructura inválida. 
          El producto debe contener exacta y únicamente estas propiedades: ${allowedKeys.join(", ")}.`));
      }
      
      const insertedId = await ProductsService.create(body);
      Response.success(res, 201, "Producto agregado", insertedId);
      
    } catch (error) {
      debug(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  generateReport: (req, res) => {
    try {
      ProductsService.generateReport("Inventario", res);
    } catch (error) {
      debug(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
  // controllers para crear endpoint update
  updateProduct: async (req, res) => {
    try {
      await ProductsService.update(req.params.id, req.body);
      Response.success(res, 200, "Producto actualizado");
    } catch (error) {
      debug(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
  // controllers para crear endpoint delete
  deleteProduct: async (req, res) => {
    try {
      await ProductsService.deleteProduct(req.params.id);
      Response.success(res, 200, "Producto eliminado");
    } catch (error) {
      debug(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  createProductsMany: async (req, res) => {
    try {
      const { body } = req;
      
      // 1.Validar que body existe y es un array no vacío
      if (!body || !Array.isArray(body) || body.length === 0) {
        return Response.error(res, new createError.BadRequest("Se requiere un array de productos"));
      } 
      // 2.Validar que cada producto en el array tenga las propiedades necesarias
      const allowedKeys = ["name", "price", "stock"];

      for (const product of body) {
        const productKeys = Object.keys(product); // por cada objeto 'product' del array, obtener las propiedades clave de dichos productos
        //validar q no contenga propiedades no permitidas
        const hasExtraKeys = productKeys.some(key => !allowedKeys.includes(key));
        //validar que contenga todas las propiedades requeridas
        const hasAllRequired = allowedKeys.every(key => productKeys.includes(key));

        if(hasExtraKeys || !hasAllRequired ){
          return Response.error(res, new createError.BadRequest(`Estructura inválida. Los productos deben contener exacta y únicamente estas propiedades: ${allowedKeys.join(", ")}.`));
        }
        
        // 3. (Opcional pero recomendado) Validar que los tipos de datos sean correctos
        if (typeof product.name !== "string" || typeof product.price !== "number" || typeof product.stock !== "number") {
          return Response.error(res, new createError.BadRequest("Tipos de datos inválidos: 'name' debe ser texto, y 'price' y 'stock' deben ser números."));
        }
      }

      //Si todo va bien, guardamos y respondemos con succes
      const insertedIds = await ProductsService.createMany(body);
      Response.success(res,201,`${body.length} productos agregados a la BD`,{ insertedIds });

    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
};
