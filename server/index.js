require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const socketManager = require("./socket");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/codeBlock", require("./routes/codeBlock"));
app.use('/api/message', require('./routes/message'));  

// default
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("success db connection"))
  .catch(err => console.error("failed db connection", err));

socketManager(io); 

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
