import express, { response } from "express";
import { createUser, genPassword, getUserByName } from "../helper.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { config } from "dotenv";
config();

var router = express.Router();

router.post("/signup", async (request, response) => {
  const { username, password } = request.body;
  const userFromDB = await getUserByName(username);
  console.log(userFromDB);
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
  var regularExpression = /(?=.*?[A-Z])/;
  if (!regularExpression.test(password)) {
    response.status(401).send({
      msg: "password should contain at least one upper case",
    });
    return;
  }
  const hashedPassword = await genPassword(password);
  const result = await createUser(username, hashedPassword);
  response.send(result);
});

router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const userFromDB = await getUserByName(username);

  // Check for username
  if (!userFromDB) {
    response.status(401).send({ msg: "Invalid Credentials " });
    return;
  }
  const storedPassword = userFromDB.password;
  console.log(storedPassword);
  const isPasswordMatch = await bcrypt.compare(password, storedPassword);
  console.log(isPasswordMatch);
  if (isPasswordMatch) {
    const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY); // we need to hide secret key to .env
    response.send({ msg: "successfully login", token });
  } else {
    response.send({ msg: " login failed invalid credentials " });
  }
});

export const usersRouter = router;
