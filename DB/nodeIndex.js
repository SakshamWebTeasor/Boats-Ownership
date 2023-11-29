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

const genAuth = ({ email, password }) => {
  const dbData = fs.readFileSync("BoatCoowner.json", "utf8");
  const db = JSON.parse(dbData);
  const user = db.Users.find((u) => u.email == email);
  return {
    user: { ...user, password: undefined, id: undefined },
    bool: user.password == password,
    token: generateToken(user),
  };
};

const authorize = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ data: {}, status: 401, message: "Token not provided" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ data: {}, status: 401, message: "Invalid token" });
    }
    const dbData = fs.readFileSync("BoatCoowner.json", "utf8");
    const db = JSON.parse(dbData);
    const user = db.Users.find((u) => u.id == decoded.id);
    req.user = user;
    // if (!decoded.roles.includes("admin")) {
    //   return res
    //     .status(403)
    //     .json({ data: {}, status: 401, message: "Unauthorized" });
    // }
    next();
  });
};

function generateToken(user) {
  const payload = {
    id: user.id,
    userEmail: user.email,
    age: user.age,
  };
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
  const { user, bool, token } = genAuth(req.body);
  res.status(bool ? 200 : 404).json({
    data: {
      user: bool ? user : undefined,
    },
    token: token,
    message: bool ? "login success" : "login failed",
    status: bool ? 200 : 404,
  });
});

server.get("/AuthUserTest", authorize, (req, res) => {
  res.status(200).json({
    data: [],
    message: "no message",
    status: 200,
  });
});

server.post("/approveBoatBookingRequest", authorize, (req, res) => {
  const { bookingId } = req.body;
  const filePath = "BoatCoowner.json";
  try {
    const dbData = fs.readFileSync(filePath, "utf8");
    const db = JSON.parse(dbData);
    const bookingIndex = db.BoatBookings.findIndex((u) => u.id == bookingId);
    const booking = db.BoatBookings[bookingIndex];
    if (!booking.NeedApprovalFrom.includes(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized", status: 403 });
    }
    if (booking.ApprovedBy.includes(req.user.id)) {
      return res.status(400).json({ message: "Already approved", status: 400 });
    }
    booking.ApprovedBy.push(req.user.id);
    booking.Approved = booking.NeedApprovalFrom.every((userId) =>
      booking.ApprovedBy.includes(userId)
    );
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf8");
    res.status(200).json({
      data: booking,
      message: "Booking approved successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
});

server.post("/requestBoatBookingRequest", authorize, (req, res) => {
  const { date } = req.body;

  // implement logic for request booking here

  try {
    res.status(200).json({
      data: date,
      message: "Booking request created successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
});

server.use("/api", router);
server.listen(3005, () => {
  console.log("JSON Server is running");
});
