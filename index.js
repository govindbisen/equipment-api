import express, { response } from "express";
import { config } from "dotenv";
import { MongoClient } from "mongodb";
config();
console.log(process.env.MONGO_URL);

const PORT = 9000;

const app = express();

app.use(express.json());

async function createConnection() {
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  console.log("mongodb connected");
  return client;
}
const client = await createConnection();

app.get("/", (request, response) => {
  response.send("Server is running!!");
});

app.get("/equipments", async (request, response) => {
  const filter = request.query;
  console.log(filter);
  if (filter.e_id) {
    filter.e_id = parseInt(filter.e_id);
  }
  //normally db.coll.find({language:"hindi",rating:8})
  const filteredEquipment = await getAllEquipments(filter); // if we want curser then no need to use toArray()
  response.send(filteredEquipment);
});

app.get("/equipment/:id", async (request, response) => {
  const { id } = request.params;
  console.log(id);
  const equipment = await getEquipmentById(id);
  equipment
    ? response.send(equipment)
    : response.status(404).send({ msg: "no movie with this id" });
});

app.post("/equipments", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await createEquipments(data);
  response.send(result);
  //data should be in json
});

//delete movie by id
app.delete("/equipment/:e_id", async (request, response) => {
  const { e_id } = request.params;
  console.log(e_id);
  const result = await deleteEquipmentById(e_id);
  result.deletedCount > 0
    ? response.send(result)
    : response.status(404).send({ message: "no match" });
});

app.put("/equipment/:e_id", async (request, response) => {
  const { e_id } = request.params;
  console.log(e_id);
  const data = request.body;
  const result = await updateEquipmentById(e_id, data);
  const updatedEquipment = await getEquipmentById(e_id);
  response.send(updatedEquipment);
});

app.listen(PORT, () => console.log("App is running"));

async function updateEquipmentById(e_id, data) {
  return await client
    .db("ERP")
    .collection("equipment")
    .updateOne({ e_id: +e_id }, { $set: data });
}

async function createEquipments(data) {
  return await client.db("ERP").collection("equipment").insertMany(data);
}

function getAllEquipments(filter) {
  return client.db("ERP").collection("equipment").find(filter).toArray();
}

async function deleteEquipmentById(e_id) {
  return await client
    .db("ERP")
    .collection("equipment")
    .deleteOne({ e_id: +e_id });
}

async function getEquipmentById(id) {
  return await client
    .db("ERP")
    .collection("equipment")
    .findOne({ e_id: +id });
}
