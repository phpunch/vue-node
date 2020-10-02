const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

require("./models/User");
require("./models/Category");

mongoose.connect("mongodb://mongo:27017/testproject", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected!!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

require("./routes/User")(app);
require("./routes/Category")(app);
require("./routes/Image")(app);

server.listen(80);

io.on("connection", function(socket) {
  // connected io success
  console.log("a user connected ", socket.id);
  socket.on("message", msg => io.emit("message", msg));
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
