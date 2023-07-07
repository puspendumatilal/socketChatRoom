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

const port = process.env.PORT || 8082;
const secret_Key = process.env.HMAC_SECRET_KEY

const data = "hi";
const enc = oaep.encryptValue(data);

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
    `SELECT user_name, user_id, user_full_name, user_image 
    from chat_users where user_name="${req.body.username}"
    AND user_password="${req.body.password}"`,
    function (error, results, fields) {
      if (error) throw error;

      if (results.length == 1) {
        res.send({ status: true, data: results[0], server_pk: oaep.publicKey,hmac_key:'dummyHMACKey' });
      } else {
        res.send({ status: false });
      }
    }
  );
});

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
  socket.on("disconnect", () => {
    connectedUsers = connectedUsers.filter(
      (item) => item.socketId != socket.id
    );
    io.emit("updateUserList", connectedUsers);
  });

  socket.on("loggedin", function (user) {
    clientSocketIds.push({ socket: socket, userId: user.user_id });
    connectedUsers = connectedUsers.filter(
      (item) => item.user_id != user.user_id
    );
    connectedUsers.push({ ...user, socketId: socket.id });
    io.emit("updateUserList", connectedUsers);
  });

  socket.on("create", function (data) {
    socket.join(data.room);
    let withSocket = getSocketByUserId(data.withUserId);
    socket.broadcast.to(withSocket.id).emit("invite", { room: data });
  });
  socket.on("joinRoom", function (data) {
    socket.join(data.room.room);
  });

  socket.on("message", async function (data) {
    console.log("Data======",data);
    console.log("hmac data======",hmacAuth)
    // this enc will come from FE
    const digest = await hmacAuth.generateHmac(secret_Key, data.message);
    data.message = oaep.encryptValue(data.message); // Delete this line when FE works
    
    let decMessage = oaep.decryptValue(data.message);

    let encMessage = oaep.encryptValue(decMessage); //, data.to_user_pk); // this public key will come from FE

    const receivedDigest = digest;
    await hmacAuth.verifyHmac(secret_Key, decMessage, receivedDigest);
    data.message = decMessage;
    socket.broadcast.to(data.room).emit("message", data);
  });
});
/* socket function ends */

server.listen(port, function () {
  console.log(`server started at ${port}`);
});
