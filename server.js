const dotenv = require("dotenv");
let express = require("express");
let bodyparser = require("body-parser");
var mysql = require("mysql");
const path = require("path");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const oaep = require("./app/js/oaep_func");
const hmacAuth = require('./app/js/hmac_auth')



dotenv.config();

const data = "hi";
const enc = oaep.encryptValue(data);
//console.log(oaep.decryptValue(enc));
//console.log(oaep.publicKey);

app.use(express.static("app"));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use(bodyparser.json());

let clientSocketIds = [];
let connectedUsers = [];
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12#$qwER",
  database: "testdb",
});

app.post("/login", (req, res) => {
  connection.query(
    `SELECT user_name, user_id, user_full_name, user_image from chat_users where user_name="${req.body.username}" AND user_password="${req.body.password}"`,
    function (error, results, fields) {
      if (error) throw error;

      if (results.length == 1) {
        res.send({ status: true, data: results[0], server_pk: oaep.publicKey });
      } else {
        res.send({ status: false });
      }
    }
  );
});
// Example usage
const key = "secret_key";
const message = "Hello, world!";
// const digest = generateHmac(key, message);
// console.log("Generated HMAC:", digest);
// // Simulating a received message and digest
// const receivedMessage = "Hello, world!";
// const receivedDigest = digest;
// verifyHmac(key, receivedMessage, receivedDigest);

const getSocketByUserId = (userId) => {
  let socket = "";
  for (let i = 0; i < clientSocketIds.length; i++) {
    if (clientSocketIds[i].userId == userId) {
      socket = clientSocketIds[i].socket;
      break;
    }
  }
  return socket;
};

/* socket function starts */
io.on("connection", (socket) => {
  console.log("Socket Connected");
  socket.on("disconnect", () => {
    console.log("disconnected");
    connectedUsers = connectedUsers.filter(
      (item) => item.socketId != socket.id
    );
    io.emit("updateUserList", connectedUsers);
  });

  socket.on("loggedin", function (user) {
    console.log("user Pushed", user);
    clientSocketIds.push({ socket: socket, userId: user.user_id });
    connectedUsers = connectedUsers.filter(
      (item) => item.user_id != user.user_id
    );
    connectedUsers.push({ ...user, socketId: socket.id });
    io.emit("updateUserList", connectedUsers);
  });

  socket.on("create", function (data) {
    console.log("create room", data);
    socket.join(data.room);
    let withSocket = getSocketByUserId(data.withUserId);
    socket.broadcast.to(withSocket.id).emit("invite", { room: data });
  });
  socket.on("joinRoom", function (data) {
    console.log("inside join room");
    socket.join(data.room.room);
  });

  socket.on("message", async function (data) {
  //  console.log("message 79", data);
    // this enc will come from FE

    console.log("data.message----",data.message)
    const digest = await hmacAuth.generateHmac(key, data.message);
    data.message = oaep.encryptValue(data.message); // Delete this line when FE works
    console.log("Generated HMAC:", digest,"      ",data.message);

   // console.log("message 82", data);
    let decMessage = oaep.decryptValue(data.message);

    let encMessage = oaep.encryptValue(decMessage); //, data.to_user_pk); // this public key will come from FE

    const receivedDigest = digest;
    console.log("meessage=====",decMessage)
    await hmacAuth.verifyHmac(key, decMessage, receivedDigest);
    data.message = decMessage;
   // console.log("message 87", data);
    socket.broadcast.to(data.room).emit("message", data);
  });
});
/* socket function ends */

server.listen(8082, function () {
  console.log("server started");
});
