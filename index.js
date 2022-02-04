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
  const filteredEquipment = await client
    .db("ERP")
    .collection("equipment")
    .find(filter)
    .toArray(); // if we want curser then no need to use toArray()
  response.send(filteredEquipment);
});

app.get("/equipment/:id", async (request, response) => {
  const { id } = request.params;
  console.log(id);
  const equipment = await client
    .db("ERP")
    .collection("equipment")
    .findOne({ e_id: id });
  equipment
    ? response.send(equipment)
    : response.status(404).send({ msg: "no movie with this id" });
});

app.post("/equipments", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await client
    .db("ERP")
    .collection("equipment")
    .insertMany(data);
  response.send(result);
  //data should be in json
});

app.listen(PORT, () => console.log("App is running"));
