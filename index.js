import express, { response } from "express";
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import { equipmentsRouter } from "./routes/equipments.js";
import { usersRouter } from "./routes/users.js";

config();
console.log(process.env.MONGO_URL);

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.use(cors());

async function createConnection() {
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  console.log("mongodb connected");
  return client;
}

export const client = await createConnection();

app.get("/", (request, response) => {
  response.send("Server is up and running!!");
});

app.use("/equipments", equipmentsRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => console.log("App is running"));
