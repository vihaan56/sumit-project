const express = require("express");
var cors = require("cors");
var routes = require("./routes/routes");
var auth = require("./routes/auth");
const app = express();
const port = process.env.PORT || 3002;
const dotenv = require("dotenv");
const path = require("path");
const Document = require("./models/Documents");

app.use(cors());
// app.use(express.static("./public"))
dotenv.config();
app.use(express.json());
const Y = require("yjs");

app.get("/", (req, res) => {
  res.send("api is running...");
});

const connect = require("./connections/connections");
const { createSocket } = require("dgram");
app.use("/api/v1/routes", routes);
app.use("/api/v1/secure", auth);

connect();

const server = app.listen(port, () => {
  console.log(`This app listing at :${port}`);
});

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});


const ydoc = new Y.Doc();
// const roomMap = new Map();


io.on("connection", (socket) => {
  // Connect event
  var room = null;

  socket.on("join-room", (roomname) => {
    const roomGroup = `group_${roomname}`;
    socket.join(roomGroup);
    room = roomGroup;
    
  });
  
  // socket.on("yjs-sync", () => {
  //   if(room){
  //   socket.to(room).emit("yjs-sync", Y.encodeStateAsUpdate(ydoc));
  //   }
  // });
  socket.on("yjs-update", (update) => {
    Y.applyUpdate(ydoc, update);

    
    io.to(room).emit("yjs-update", update);
  });

  // socket.on('message', (data) => {

  //   io.to(roomGroup).emit('message', {
  //     payload: data,
  //     senderChannelName: socket.id,
  //   });
  // });

  socket.on("disconnect", () => {
    // Disconnect event
    // Handle disconnect logic if needed
  });
});
