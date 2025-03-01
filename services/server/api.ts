import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

export const api = express();
api.use(bodyParser.text());
api.use(bodyParser.json({ limit: "500kb" }));
api.use(bodyParser.urlencoded({ extended: false, limit: "15mb" }));
api.use(cookieParser());

api.get("/health", (req, res) => {
  res.status(200).send("I am alive 😘");
});
