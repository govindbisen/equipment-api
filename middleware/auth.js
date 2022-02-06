// this middleware will check if token is valid or not
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const auth = (request, response, next) => {
  try {
    const token = request.header("x-auth-token");
    console.log("token", token);
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    response.status(401).send({ error: error.message });
  }
};
