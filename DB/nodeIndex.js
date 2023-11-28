const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("BoatCoowner.json");
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(express.json());

const secretKey = process.env.SECRET_KEY || "12rtu20@s";

server.use("/user", (req, res, next) => {
  try {
    if (isAuthorized(req.query).bool) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
  }
});

const isAuthorized = ({ email, password }) => {
  const dbData = fs.readFileSync("BoatCoowner.json", "utf8");
  const db = JSON.parse(dbData);
  const user = db.Users.find((u) => u.email == email);
  return {
    user: { ...user, password: undefined, id: undefined },
    bool: user.password == password,
    token: generateToken(user),
  };
};

function generateToken(user) {
  const payload = {
    id: user.id,
    userEmail: user.email,
    age: user.age,
  };
  console.log("====================================");
  console.log("payload", payload);
  console.log("====================================");
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  return token;
}

server.get("/", (req, res) => {
  res.status(200).json({
    data: [],
    message: "no message",
    status: 200,
  });
});

server.post("/login", (req, res) => {
  const { user, bool, token } = isAuthorized(req.body);
  res.status(bool ? 200 : 404).json({
    data: {
      user: bool ? user : undefined,
    },
    token: token,
    message: bool ? "login success" : "login failed",
    status: bool ? 200 : 404,
  });
});

server.use("/api", router);
server.listen(3005, () => {
  console.log("JSON Server is running");
});
