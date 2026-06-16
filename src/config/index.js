// Esto permite cargar las variables de entorno desde el archivo .env,
// para que podamos acceder a ellas a través de process.env
require("dotenv").config();

// Esto permite que importemos el archivo de configuracion en otras partes de la aplicacion,
//  y acceder a las variables de entorno a través de config.port
module.exports.config = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  mongoDbname: process.env.MONGO_DBNAME,
};
