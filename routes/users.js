import express, { response } from "express";
import { createUser, genPassword, getUserByName } from "../helper.js";

import bcrypt from "bcrypt";

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
    response.send({
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
    response.status(400).send({ msg: "Invalid Credentials " });
    return;
  }

  const storedPassword = userFromDB.password;
  console.log(storedPassword);
  const isPasswordMatch = await bcrypt.compare(password, storedPassword);
  console.log(isPasswordMatch);
  if (isPasswordMatch) {
    response.send({ msg: "successfully login" });
  } else {
    response.send({ msg: " login failed invalid credentials " });
  }
});

export const usersRouter = router;
