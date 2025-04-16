const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const logger = require("morgan");
const db = require("./model/connection");
const {delete_unbooked_slots,email_to_notify_booking_time,change_status_of_non_consulted_slots}=require("./helper/croneJob")
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const userrouter = require("./routes/userRoutes");
const doctorrouter = require("./routes/doctorRoutes");
const adminrouter = require("./routes/adminRoutes");
const server = http.createServer(app);
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // Add this line


require("dotenv").config();

const port = process.env.port_no || 3000;

//socketIO connection
const io = socketIo(server, {
  pingTimeout: 10000,
  cors: {
  origin: [process.env.local_api,process.env.vercel_api,process.env.hosted_api]
  },
});

app.use(cors({ origin: [process.env.local_api,process.env.vercel_api,hosted_api] }));

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
change_status_of_non_consulted_slots()
server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
