// Esta capa del modulo products, se va a encargar de la comunicacion con la base de datos

//1. importamos el modulo de database
const { Database } = require("../database/index");
const { ObjectId } = require("mongodb");

//2. Creamos las funciones del modulo de servicios
// variable para la colleccion 'products' en mongo
const COLLECTION = "products";

const getAll = async () => {
  const collection = await Database(COLLECTION);
  return await collection.find({}).toArray();
};

const getById = async (id) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid ID format");
  const collection = await Database(COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
};

const create = async (product) => {
  const collection = await Database(COLLECTION);

  let result = await collection.insertOne(product);
  return result.insertedId;
};

const createMany = async (products) => {
  const collection = await Database(COLLECTION);

  let result = await collection.insertMany(products);
  return result.insertedIds;
};
//4. Importar nuestro modulo services en el de products/controller

//5. Importamos nuestro modulo de 'utils' en este 'products'
const { ProductsUtils } = require("./utils");

//6.Usamos el modulo desestructurado en una una funcion asincrona
const generateReport = async (name, res) => {
  let products = await getAll();
  ProductsUtils.excelGenerator(products, name, res);
};

// 8. funcion para el update

/**
 * Description placeholder
 *
 * @async
 * @param {ObjectId} id Formato cadena
 * @param {Object} product //Objeto con los campos a actualizar
 * @returns El objeto result generado por la actualizacion 'updateOne'
 */
const update = async (id, product) => {
  // 1.5 Validacion de argumentos
  if (!ObjectId.isValid(id)) throw new Error("Invalid ID format");
  if (
    !product ||
    typeof product !== "object" ||
    Object.keys(product).length === 0
  ) {
    throw new Error(
      "Invalid arguments: 'product' object with data is required",
    );
  }

  // 1. Obtener la conexión a la colección de la base de datos
  const collection = await Database(COLLECTION);

  // Evitar que el _id se incluya en el $set si viene en el objeto product
  const { _id, ...updateData } = product;
  console.log("Datos que se van a actualizar en el producto:", updateData);

  // 2. Realizar la operación de actualización
  const result = await collection.updateOne(
    { _id: new ObjectId(id) }, // Filtro: Busca el documento por su ID único de MongoDB
    { $set: { ...updateData } }, // Actualización: Establece los campos con los datos proporcionados
    { upsert: false }, // Opción: No inserta un nuevo documento si no se encuentra una coincidencia
  );
  return result;
};
// 9. funcion para el delete
const deleteProduct = async (id) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid ID format");
  const collection = await Database(COLLECTION);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result;
};

// 10. Función para decrementar el stock de un producto de forma atómica
/**
 * Decrementa el stock de un producto de forma atómica, solo si hay suficiente stock.
 * @async
 * @param {ObjectId} productId El ID del producto.
 * @param {number} quantity La cantidad a decrementar.
 * @returns {Object|null} El documento del producto actualizado si la operación fue exitosa, o null si no había suficiente stock o el producto no existe.
 */
const decrementStock = async (productId, quantity) => {
  if (!ObjectId.isValid(productId)) throw new Error("Invalid ID format");
  const collection = await Database(COLLECTION); // COLLECTION aquí se refiere a 'products'

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(productId), stock: { $gte: quantity } }, // Filtro: busca por ID y stock suficiente
    { $inc: { stock: -quantity } }, // Actualización: decrementa el stock
    { returnDocument: "after" }, // Opciones: devuelve el documento después de la actualización
  );

  return result; // En mongodb v7, findOneAndUpdate devuelve el documento directamente
};

//Exportar 'services'
module.exports.ProductsService = {
  //Al poner como clave el nombre de la funcion, se asume la función como valor.
  getAll,
  getById,
  create,
  generateReport,
  update,
  deleteProduct,
  decrementStock,
  createMany,
};
