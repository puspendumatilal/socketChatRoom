// import hmac from "../middleware/hmacAuth";

// // online user using mongo realtime
// // public group
// // private group
// // 1 to 1 chat

// let clientSocketIds: string[] = [];
// let connectedUsers: string[] = [];

// const getSocketByUserId = (userId: String) => {
//     let socket = "";
//     for (let i = 0; i < clientSocketIds.length; i++) {
//         if (clientSocketIds[i].userId == userId) {
//             socket = clientSocketIds[i].socket;
//             break;
//         }
//     }
//     return socket;
// };

// /* socket function starts */
// module.exports.socketFunc = (socket, io) => {
//     console.log("conected");
//     socket.on("disconnect", () => {
//         console.log("disconnected");
//         connectedUsers = connectedUsers.filter(
//             (item) => item.socketId != socket.id
//         );
//         io.emit("updateUserList", connectedUsers);
//     });

//     console.log("connected user ==>>", connectedUsers.length);
//     // socket.on("loggedin", function (user) {
//     //     clientSocketIds.push({ socket: socket, userId: user.user_id });
//     //     connectedUsers = connectedUsers.filter(
//     //         (item) => item.user_id != user.user_id
//     //     );
//     //     connectedUsers.push({ ...user, socketId: socket.id });
//     //     io.emit("updateUserList", connectedUsers);
//     // });

//     socket.on("createpublicroom", function (data) {
//         console.log("createpublicroom", data);
//         const isAuthenticated = hmac.verifySocketHmac(data.x_e2e_crypto_key, data.x_e2e_crypto_iv);
//         if (isAuthenticated) {
//             socket.join(data.room);
//         } else {
//             socket.broadcast.to(data.room).emit("authentication", "Authentication Fails");
//         }
//     });

//     socket.on("createprivateroom", function (data) {
//         console.log("createprivateroom", data);
//         const isAuthenticated = hmac.verifySocketHmac(data.x_e2e_crypto_key, data.x_e2e_crypto_iv);
//         if (isAuthenticated) {
//             socket.join(data.room);
//         } else {
//             socket.broadcast.to(data.room).emit("authentication", "Authentication Fails");
//         }
//     });

//     socket.on("create", function (data) {
//         console.log(socket.id);
//         console.log("create", data);
//         const isAuthenticated = hmac.verifySocketHmac(data.x_e2e_crypto_key, data.x_e2e_crypto_iv);
//         if (isAuthenticated) {
//             socket.join(data.room);
//             let withSocket = getSocketByUserId(data.withUserId);
//             socket.broadcast.to(withSocket.id).emit("invite", { room: data });
//         } else {
//             socket.broadcast.to(data.room).emit("authentication", "Authentication Fails");
//         }
//     });

//     socket.on("joinRoom", function (data) {
//         console.log("joinRoom", data);
//         const isAuthenticated = hmac.verifySocketHmac(data.x_e2e_crypto_key, data.x_e2e_crypto_iv);
//         if (isAuthenticated) {
//             socket.join(data.room);
//         } else {
//             socket.broadcast.to(data.room).emit("authentication", "Authentication Fails");
//         }

//     });

//     socket.on("message", function (data) {
//         console.log("message", data);
//         const isAuthenticated = hmac.verifySocketHmac(data.x_e2e_crypto_key, data.x_e2e_crypto_iv);
//         if (isAuthenticated) {
//             socket.broadcast.to(data.room).emit("message", data.message);
//         } else {
//             socket.broadcast.to(data.room).emit("authentication", "Authentication Fails");
//         }
//     });

//     socket.on("online", function (data) {
//         console.log("online", data);
//         const isAuthenticated = hmac.verifySocketHmac(data.x_e2e_crypto_key, data.x_e2e_crypto_iv);
//         if (isAuthenticated) {
//             // update user then user online
//         } else {
//             socket.broadcast.to(data.room).emit("authentication", "Authentication Fails");
//         }
//     });

//     socket.on("typing", function (data) {
//         console.log("online", data);
//         const isAuthenticated = hmac.verifySocketHmac(data.x_e2e_crypto_key, data.x_e2e_crypto_iv);
//         if (isAuthenticated) {
//             // update user then user typing
//         } else {
//             socket.broadcast.to(data.room).emit("authentication", "Authentication Fails");
//         }
//     });

//     socket.on("offline", function (data) {
//         console.log("offline", data);
//         const isAuthenticated = hmac.verifySocketHmac(data.x_e2e_crypto_key, data.x_e2e_crypto_iv);
//         if (isAuthenticated) {
//             // update online user list when someone is offline / close chat app
//         } else {
//             socket.broadcast.to(data.room).emit("authentication", "Authentication Fails");
//         }
//     });
// }
// /* socket function ends */
