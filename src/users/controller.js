const { UsersService } = require("./services");
const debug = require("debug")("app:module-users-controller");

const { Response } = require("../common/response");
const createError = require("http-errors");

module.exports.UsersController = {
  getUsers: async (request, response) => {
    try {
      let users = await UsersService.getAll();
      Response.success(response, 200, "Lista de usuarios", users);
    } catch (error) {
      debug(error);
      Response.error(response);
    }
  },

  getUser: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;

      let user = await UsersService.getById(id);
      if (!user) {
        Response.error(res, new createError.NotFound());
      } else Response.success(res, 200, `Usuario ${id}`, user);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  createUser: async (req, res) => {
    try {
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest());
      } else {
        const insertedId = await UsersService.create(body);
        Response.success(res, 201, "Usuario agregado", insertedId);
      }
    } catch (error) {
      debug(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      await UsersService.update(req.params.id, req.body);
      Response.success(res, 200, "Usuario actualizado");
    } catch (error) {
      debug(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await UsersService.deleteProduct(req.params.id);
      Response.success(res, 200, "Usuario eliminado");
    } catch (error) {
      debug(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
};
