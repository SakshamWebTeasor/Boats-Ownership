const jsonServer = require("json-server");
const axios = require("axios");
const server = jsonServer.create();
const filePath = "BoatCoowner.json";
const router = jsonServer.router(filePath);
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const middlewares = jsonServer.defaults();
const ApiMainLink = "https://c2b0-27-255-222-177.ngrok-free.app";

server.use(middlewares);
server.use(express.json());

const secretKey = process.env.SECRET_KEY || "12rtu20@s";

const genAuth = ({ email, password }) => {
  const dbData = fs.readFileSync(filePath, "utf8");
  const db = JSON.parse(dbData);
  const user = db.Users.find((u) => u.email == email);
  return {
    user: { ...user, password: undefined, id: undefined },
    bool: user?.password == password,
    token: user?.password == password ? generateToken(user) : undefined,
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
    const dbData = fs.readFileSync(filePath, "utf8");
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

const formatDate = (date) => {
  const inputDate = typeof date === "string" ? new Date(date) : date;
  const dayOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "IST",
  };
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  const day = inputDate
    .toLocaleDateString("en-US", dayOptions)
    .split("/")
    .join("-");
  const time = inputDate.toLocaleTimeString("en-US", timeOptions);
  return { day, time };
};

function convertDate(date1, date2) {
  const inputDate1 = new Date(date1);
  const inputDate2 = new Date(date2);
  const { day: dayStart, time: timeStart } = formatDate(inputDate1);
  const { day: dayEnd, time: timeEnd } = formatDate(inputDate2);
  return { dayStart, timeStart, dayEnd, timeEnd };
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
    message: bool ? "login success" : "login failed, invalid credentials",
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

server.post("/requestBoatBookingRequest", authorize, async (req, res) => {
  const { date, boatId, endDate } = req.body;
  if (!boatId || !date) {
    return res.status(400).json({
      data: {},
      message: "boatId & date are required fields",
      status: 400,
    });
  }
  try {
    const db = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const gotBoat = db.Boats.find((boat) => boat.id == boatId);
    if (!gotBoat.OwnersUserId.includes(req.user.id)) {
      return res.status(400).json({
        data: {},
        message: "You cannot request booking on this boat",
        status: 400,
      });
    }
    const { day, time } = formatDate(date);
    const { day: dayE, time: timeE } = formatDate(endDate);
    const createdAt = formatDate(new Date());
    const boatRequestBody = {
      boatId: parseInt(boatId),
      userId: req.user.id,
      BookingDate: day,
      From: `${day}, ${time}`,
      To: `${dayE}, ${timeE}`,
      Approved: false,
      Status: "Awaiting",
      NeedApprovalFrom: [...gotBoat.OwnersUserId],
      ApprovedBy: [req.user.id],
      MustBeApproveBefore: day,
      createdAt: `${createdAt.day}, ${createdAt.time}`,
    };
    const response = await axios.post(
      `${ApiMainLink}/api/BoatBookings`,
      boatRequestBody
    );
    if (response.status === 201) {
      res.status(response.status).json({
        data: response.data,
        message: "Booking request created successfully",
        status: response.status,
      });
    } else {
      console.error(`Error in request booking ${response.statusText}`);
      res
        .status(response.status)
        .json({ message: response.statusText, status: response.status });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
});

server.use("/api", router);
server.listen(3005, () => {
  console.log("JSON Server is running");
});
