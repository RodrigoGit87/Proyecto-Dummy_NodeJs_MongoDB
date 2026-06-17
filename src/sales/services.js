const { Database } = require("../database/index");
const { UsersService } = require("../users/services");
const { ProductsService } = require("../products/services"); // Importar el servicio de productos
const COLLECTION = "sales";
const { ObjectId } = require("mongodb");

const getAll = async () => {
  const collection = await Database(COLLECTION);
  return await collection.find({}).toArray();
};

const getById = async (id) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid ID format");
  const collection = await Database(COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
};

const update = async (id, sale) => {
  if (!ObjectId.isValid(id) || !sale || typeof sale !== "object") {
    throw new Error("Invalid arguments: 'id' and 'sale' object are required");
  }
  const collection = await Database(COLLECTION);

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...sale } }, 
    { upsert: false }  
  );
  return result;
};

const deleteSale = async (id) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid ID format");
  const collection = await Database(COLLECTION);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result;
};


/**
 * Registra una nueva venta, gestionando el stock del producto.
 * @async
 * @param {string} productId El ID del producto a vender.
 * @param {string} userId El ID del usuario que realiza la compra.
 * @param {number} quantity La cantidad del producto a vender.
 * @returns {ObjectId} El ID del registro de venta creado.
 * @throws {Error} Si los argumentos son inválidos, el stock es insuficiente o el producto no se encuentra.
 */
const registerSale = async (saleData) => {
  const salesCollection = await Database(COLLECTION);

  // 1. Validar entradas
  const { productId, userId, quantity } = saleData; // Esto indica que el JSON que envíes por Postman debe tener exactamente esas tres llaves: "productId", "userId" y "quantity".
  if (!productId || !userId || quantity === undefined || quantity <= 0) { // quantity puede ser 0 si se envía, pero debe ser > 0
    throw new Error("Invalid arguments: productId, userId, and a positive quantity are required.");
  }

  // Asegurarse de que los IDs sean instancias de ObjectId
  const productObjectId = new ObjectId(productId);
  const userObjectId = new ObjectId(userId);
  
  // 1.5 Verificar si el producto existe antes de intentar la operación atómica
  const product = await ProductsService.getById(productId);
  if (!product) {
    throw new Error("Product not found.");
  }

  // 2. Decrementar el stock del producto de forma atómica
  const updatedProduct = await ProductsService.decrementStock(productObjectId, quantity);

  if (!updatedProduct) {
    throw new Error(`Insufficient stock. Available: ${product.stock || 0}`);
  }

  // 3. Construir el registro de venta
  // Intentamos obtener el precio desde el producto que nos devolvió el decremento
  const price = updatedProduct.unitPrice || updatedProduct.price || 0;
  const user_name = await UsersService.getById(userId);

  const saleRecord = {
    productId: productObjectId,
    productName: product.name,
    userId: userObjectId,
    userName: user_name ? user_name.nombre : "Unknown User",
    quantity: quantity,
    unitPrice: price,
    totalPrice: price * quantity,
    saleDate: new Date().toISOString(),
  };

  // 4. Crear el registro de venta en la colección de ventas
  const result = await salesCollection.insertOne(saleRecord);
  return result.insertedId;
};

module.exports.SalesService = {
  getAll,
  getById,
  update,
  deleteSale,
  registerSale,
}; 