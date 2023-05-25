const express = require("express");
var cors = require("cors");
var routes = require("./routes/routes");
var auth = require("./routes/auth");
const app = express();
const port = process.env.PORT || 3002;
const dotenv = require("dotenv");
const path = require("path");
const Document = require("./models/Documents");
const chat = require("./routes/chat");
app.use(cors());
// app.use(express.static("./public"))
dotenv.config();
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const Y = require("yjs");

app.get("/", (req, res) => {
  res.send("api is running...");
});

const connect = require("./connections/connections");
const { createSocket } = require("dgram");
app.use("/api/v1/routes", routes);
app.use("/api/v1/secure", auth);
app.use("/api/v1/chat", chat);

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
const yarray = ydoc.getArray("array");
const awarenessMap = ydoc.getMap("awareness");

const roomMap = new Map();
const awarenessStates = new Map();
const activeUsers = new Set();

io.on("connection", (socket) => {
  // Connect event
  var room = null;
  var name = null;

  socket.on("join-room", (roomname,username) => {
    const roomGroup = `group_${roomname}`;

    if(!username) return;
    socket.join(roomGroup);
    room = roomGroup;
    name = username;

    // roomMap.set(socket.id, roomGroup);
  
    socket.broadcast.to(room).emit("room-join",username);

    const user = {
      id: socket.id,
      name: name
    };

    console.log(`${room}$$${socket.id}$$${username}`);

    activeUsers.add(`${room}$$${socket.id}$$${username}`);
    roomMap.set(socket.id, username);
    awarenessMap.set(socket.id, user);
    awarenessStates.set(socket.id, user);
    console.log(room);
    io.to(room).emit("activeUsersCount", {activeusers:Array.from(activeUsers).filter((user) =>
      user.startsWith(`${room}$$`))});



    // Create and store the awareness state for the socket
    // awarenessStates.set(socket.id, aware);

    // // Bind awareness to the Yjs document
    // aware.bindSocket(socket);
    
  });
  socket.on("send-message",(data)=>{
     socket.broadcast.to(room).emit("chat-message",data);

  })

  socket.on("update_title",(data)=>{
    console.log(data);
     socket.broadcast.to(room).emit("broadcast_update_title",data);
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

  socket.on('disconnect', () =>{
    activeUsers.delete(`${room}$$${socket.id}$$${name}`);
    console.log(activeUsers)
    io.to(room).emit("activeUsersCount", {activeusers:Array.from(activeUsers)});
    io.to(room).emit('disconnect-user',name);


  });

});
