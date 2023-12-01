const jsonServer = require("json-server");
const axios = require("axios");
const server = jsonServer.create();
const filePath = "BoatCoowner.json";
const router = jsonServer.router(filePath);
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const middlewares = jsonServer.defaults();
const ApiMainLink = "https://d398-124-253-1-205.ngrok-free.app";

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
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
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
    if (!decoded.role.includes("admin")) {
      return res
        .status(403)
        .json({ data: {}, status: 401, message: "Unauthorized" });
    }
    const user = db.Users.find((u) => u.id == decoded.id);
    req.user = user;
    next();
  });
};

function generateToken(user) {
  const payload = {
    id: user.id,
    userEmail: user.email,
    age: user.age,
    role: user.role,
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

server.post("/admin/addBoat", authorizeAdmin, async (req, res) => {
  const boatData = req.body;
  const { name, type, length, capacity, location, Price, ImgLink } = boatData;
  if (!name || !type || !length || !capacity || !location || !Price || !ImgLink) {
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!type) missingFields.push("type");
    if (!length) missingFields.push("length");
    if (!capacity) missingFields.push("capacity");
    if (!location) missingFields.push("location");
    if (!Price) missingFields.push("Price");
    if (!ImgLink) missingFields.push("ImgLink");
    return res.status(400).json({
      data: {},
      message: `The following fields are required: ${missingFields.join(", ")}`,
      status: 400,
    });
  }
  const validImgLinkRegex =
    /^(https:\/\/i\.ibb\.co|https:\/\/plus\.unsplash\.com|https:\/\/images\.unsplash\.com)/;
  if (!validImgLinkRegex.test(ImgLink)) {
    return res.status(400).json({
      data: {},
      message:
        "Invalid Image Link. Please provide a valid Image Link.",
      status: 400,
    });
  }
  let Sold = false;
  let OwnersUserId = [];
  const addedOn = formatDate(new Date());
  try {
    const newBoat = {name, type, length, capacity, location, Price, ImgLink, Sold, OwnersUserId, addedOn};
    const response = await axios.post(`${ApiMainLink}/api/Boats`, newBoat);
    if (response.status === 201) {
      res.status(response.status).json({
        data: response.data,
        message: "Boat added successfully",
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
