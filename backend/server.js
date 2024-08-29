const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const logger = require("morgan");
const db = require("./model/connection");
const { deleteExpiredBookings } = require("./helper/deleteExpiredSlots");
const {delete_unbooked_slots,email_to_notify_booking_time}=require("./helper/croneJob")
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const userrouter = require("./routes/userRoutes");
const doctorrouter = require("./routes/doctorRoutes");
const adminrouter = require("./routes/adminRoutes");
const server = http.createServer(app);

require("dotenv").config();

const port = process.env.port_no || 3000;

//socketIO connection
const io = socketIo(server, {
  pingTimeout: 10000,
  cors: {
    // origin: "https://medilink-frontend-git-c4b0d0-fathima-nasrins-projects-5c6b05e5.vercel.app",
    origin: "https://nasrin.medilink.live",
  },
});

// app.use(cors({ origin: ["http://localhost:4200"] }));
app.use(cors({ origin: ["https://nasrin.medilink.live"] }));

app.use(express.static(path.join(__dirname, "images")));
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userrouter);
app.use("/doctor", doctorrouter);
app.use("/admin", adminrouter);
// app.use(express.static('project'))
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("newMessage", (data) => {
    console.log("newMessage in socketIO:", data);
    io.emit("messageReceived", data);
  });
});

db.connectToDatabase();
// deleteExpiredBookings();
delete_unbooked_slots()
email_to_notify_booking_time()

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
