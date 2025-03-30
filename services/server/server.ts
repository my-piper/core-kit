import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

const server = express();
server.use(bodyParser.text());
server.use(bodyParser.json({ limit: "500kb" }));
server.use(bodyParser.urlencoded({ extended: false, limit: "15mb" }));
server.use(cookieParser());

server.get("/health", (req, res) => {
  res.status(200).send("I am alive 😘");
});

server.get("/api/health", (req, res) => {
  res.status(200).send("I am alive 😘");
});

export default server;
