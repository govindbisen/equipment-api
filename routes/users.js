import express from "express";
import { genPassword } from "../helper.js";
import { client } from "../index.js";

var router = express.Router();

router.post("/signup", async (request, response) => {
  const { username, password } = request.body;
  const hashedPassword = await genPassword(password);
  const result = await client
    .db("ERP")
    .collection("users")
    .insertOne({ username, password: hashedPassword });
  response.send(result);
});

router.post("/signin", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await client.db("ERP").collection("users").findOne(data);
  response.send(result);
});

export const usersRouter = router;
