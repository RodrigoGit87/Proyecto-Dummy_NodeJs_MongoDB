const { Database } = require("../database/index");
const { ObjectId } = require("mongodb");

const COLLECTION = "users";

const getAll = async () => {
  const collection = await Database(COLLECTION);
  return await collection.find({}).toArray();
};

const getById = async (id) => {
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

  if (!id || typeof id !== "ObjectId" || !user || typeof user !== "object") {
    throw new Error("Invalid arguments: 'id' must be an ObjectId and 'product' must be an object");
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...user } }, 
    { upsert: false }  
  );
  return result;
};

const deleteUser = async (id) => {
  const collection = await Database(COLLECTION);
  if (!id) throw new Error('id argument doest not exist');
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