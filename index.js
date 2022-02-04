import express, { response } from "express";
import { config } from "dotenv";
import { MongoClient } from "mongodb";

import { equipmentsRouter } from "./routes/equipments.js";
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
export const client = await createConnection();

app.get("/", (request, response) => {
  response.send("Server is running!!");
});

app.use("/equipments", equipmentsRouter);

app.listen(PORT, () => console.log("App is running"));
