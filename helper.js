import { client } from "./index.js";
import bcrypt from "bcrypt";

async function genPassword(password) {
  const NO_OF_ROUNDS = 12;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
  return hashedPassword;
}
// genPassword("Password@123");

async function updateEquipmentById(_id, data) {
  return await client
    .db("ERP")
    .collection("equipment")
    .updateOne({ _id: _id }, { $set: data });
}

async function createEquipments(data) {
  return await client.db("ERP").collection("equipment").insertMany(data);
}

async function getAllEquipments(filter) {
  return await client.db("ERP").collection("equipment").find(filter).toArray();
}

async function deleteEquipmentById(_id) {
  return await client.db("ERP").collection("equipment").deleteOne({ _id: _id });
}

async function getEquipmentById(_id) {
  return await client.db("ERP").collection("equipment").findOne({ _id: _id });
}

export {
  updateEquipmentById,
  createEquipments,
  getAllEquipments,
  deleteEquipmentById,
  getEquipmentById,
  genPassword,
};
