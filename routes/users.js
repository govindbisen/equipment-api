import express from "express";
import { client } from "../index.js";
var router = express.Router();

router.post("/signup", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await client.db("ERP").collection("users").insertOne(data);
  response.send(result);
});

router.post("/signin", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await client.db("ERP").collection("users").findOne(data);
  response.send(result);
});

export const usersRouter = router;
