import express, { response } from "express";
import { createUser, genPassword, getUserByName } from "../helper.js";
import { client } from "../index.js";

var router = express.Router();

router.post("/signup", async (request, response) => {
  const { username, password } = request.body;

  const userFromDB = await getUserByName(username);
  if (userFromDB) {
    response.send({ msg: "user already exists" });
    return;
  }

  if (password.length < 8) {
    response.send({ msg: "password must be longer" });
    return;
  }

  // regex
  // Minimum eight characters, at least one letter and one number:
  var regularExpression = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!regularExpression.test(password)) {
    response.send({
      msg: "password should contain at least one letter and one number",
    });
    return;
  }

  const hashedPassword = await genPassword(password);
  const result = await createUser(username, hashedPassword);
  response.send(result);
});

router.post("/signin", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await client.db("ERP").collection("users").findOne(data);
  response.send(result);
});

export const usersRouter = router;
