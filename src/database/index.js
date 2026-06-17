const { MongoClient } = require("mongodb");
const debug = require("debug")("app:module-database");
const { config } = require('../config');


let connection = null;
module.exports.Database = (collection) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!connection) {
        const client = new MongoClient(config.mongoUri);
        connection = await client.connect();
        debug("Nueva conexion realizada con MongoDB");
      }
      debug("Reutilizando conexión");
      const db = connection.db(config.mongoDbname);
      resolve(db.collection(collection));
    } catch (error) {
      reject(error);
    }
  });
