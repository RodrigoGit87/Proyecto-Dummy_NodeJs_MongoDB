const { SalesService } = require("./services");
const debug = require("debug")("app:module-sales-controller");

const { Response } = require("../common/response");
const createError = require("http-errors");

module.exports.SalesController = {
  getSales: async (request, response) => {
    try {
      let sales = await SalesService.getAll();
      Response.success(response, 200, "Ventas totales", sales);
    } catch (error) {
      debug(error);
      Response.error(response);
    }
  },

  getSale: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;

      let sale = await SalesService.getById(id);
      if (!sale) {
        Response.error(res, new createError.NotFound());
      } else Response.success(res, 200, `Venta ${id}`, sale);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  updateSale: async (req, res) => {
    try {
      await SalesService.update(req.params.id, req.body);
      Response.success(res, 200, "Venta actualizada");
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  deleteSale: async (req, res) => {
    try {
      await SalesService.deleteSale(req.params.id);
      Response.success(res, 200, "Venta eliminada");
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  registerSale: async (req, res) => {
    const { body } = req;
    try {
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest("Se requieren datos para registrar la venta."));
        return;
      }
      const insertedId = await SalesService.registerSale(body);
      Response.success(res, 201, "Venta registrada exitosamente", insertedId);
    } catch (error) {
      debug(error);
      if (error.message.includes("Insufficient stock") || error.message.includes("Invalid arguments")) {
        Response.error(res, new createError.BadRequest(error.message)); // Errores de negocio/validación
      } else {
        Response.error(res, new createError.InternalServerError("Error interno al registrar la venta.")); // Otros errores
      }
    }
  }
}