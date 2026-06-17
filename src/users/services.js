const { Database } = require("../database/index");
const { ObjectId } = require("mongodb");

const COLLECTION = "users";

const getAll = async () => {
  const collection = await Database(COLLECTION);
  return await collection.find({}).toArray();
};

const getById = async (id) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid ID format");
  const collection = await Database(COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
};

const create = async (user) => {
  const collection = await Database(COLLECTION);

  let result = await collection.insertOne(user);
  return result.insertedId;
};

const update = async (id, user) => {

  const collection = await Database(COLLECTION);

  if (!ObjectId.isValid(id) || !user || typeof user !== "object") {
    throw new Error("Invalid arguments: 'id' must be a valid ObjectId and 'user' must be an object");
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...user } }, 
    { upsert: false }  
  );
  return result;
};

const deleteUser = async (id) => {
  if (!ObjectId.isValid(id)) throw new Error('Invalid ID format');
  const collection = await Database(COLLECTION);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result;
};


module.exports.UsersService = {
  getAll,
  getById,
  create,
  update,
  deleteUser
};