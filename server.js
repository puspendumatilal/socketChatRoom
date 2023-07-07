let express     = require( 'express' );
let bodyparser  = require('body-parser');
var mysql       = require('mysql');
const path      = require('path');
const app       = require('express')();
const server    = require('http').createServer(app);
const io        = require('socket.io')(server);
const oaep      = require('./app/js/oaep_func');

const data = "hi";
const enc = oaep.encryptValue(data);
console.log(oaep.decryptValue(enc));
// console.log(oaep.publicKey);
// console.log(oaep.privateKey);


app.use(express.static('app'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules', )));
app.use(bodyparser.json())

let clientSocketIds = [];
let connectedUsers= [];
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12#$qwER',
    database : 'testdb'
});


app.post('/login', (req, res) =>{
    connection.query(`SELECT user_name, user_id, user_full_name, user_image from chat_users where user_name="${req.body.username}" AND user_password="${req.body.password}"`, function (error, results, fields) {
        if (error) throw error;
        
        if(results.length == 1) {
            res.send({status:true, data: results[0], server_pk: oaep.publicKey})
        } else {
            res.send({status:false})
        }
    });
})

app.get('/public_key', (req, res) =>{
    // add some basic validation if needed
    const public_key = oaep.publicKey;
    const base64String = oaep.base64UrlSafeEncode(public_key);
    res.send({server_pk: base64String});
})

app.post('/democall', (req, res) =>{
    const encriptedKey = req.headers.x_e2e_crypto_key; 
    // return res.send({val: encriptedKey});
    const encriptedClientIV = req.headers.x_e2e_crypto_iv; 
    const jsonStringBody = oaep.serverSideDecriptionProcess(req.body.data, encriptedKey, encriptedClientIV);
    // return res.send({val: jsonStringBody});
    const jsonBody = JSON.parse(jsonStringBody);
    const msg = "I cought you " + jsonBody.name + ", you are " + jsonBody.age + " years old."
    res.send({status: "success", message: msg});
})

app.post('/demofunc', (req, res) =>{
    const reqData = req.body.data;
    let data = "blank"
    switch (req.body.case) {
        case 1: data = oaep.base64UrlSafeEncode(reqData); break;
        case 2: data = oaep.base64UrlSafeDecode(reqData); break;
        case 3: data = oaep.generateAESKeys(); break;
        case 4: data = oaep.generateIVKeys(); break;
        case 5: data = oaep.encryptValue(reqData, req.body.publicKey); break;
        case 6: data = oaep.decryptValue(reqData); break;
        case 7: data = oaep.encryptWithAES(reqData, req.body.aeskey, req.body.iv); break;
        case 8: data = oaep.decryptWithAES(reqData, req.body.aeskey, req.body.iv); break;
        case 9: data = JSON.parse(reqData);
        case 10: data = JSON.stringify(reqData);
    }
    console.log(data);
    res.send({status: "success", data: data});
})

const getSocketByUserId = (userId) =>{
    let socket = '';
    for(let i = 0; i<clientSocketIds.length; i++) {
        if(clientSocketIds[i].userId == userId) {
            socket = clientSocketIds[i].socket;
            break;
        }
    }
    return socket;
}

/* socket function starts */
io.on('connection', socket => {
    console.log('conected')
    socket.on('disconnect', () => {
        console.log("disconnected")
        connectedUsers = connectedUsers.filter(item => item.socketId != socket.id);
        io.emit('updateUserList', connectedUsers)
    });

    socket.on('loggedin', function(user) {
        clientSocketIds.push({socket: socket, userId:  user.user_id});
        connectedUsers = connectedUsers.filter(item => item.user_id != user.user_id);
        connectedUsers.push({...user, socketId: socket.id})
        io.emit('updateUserList', connectedUsers)
    });

    socket.on('create', function(data) {
        console.log("create room", data);
        socket.join(data.room);
        let withSocket = getSocketByUserId(data.withUserId);
        socket.broadcast.to(withSocket.id).emit("invite",{room:data})
    });
    socket.on('joinRoom', function(data) {
        socket.join(data.room.room);
    });

    socket.on('message', function(data) {
        console.log("message 79", data);
        // this enc will come from FE
        data.message = oaep.encryptValue(data.message); // Delete this line when FE works
        console.log("message 82", data);
        let decMessage = oaep.decryptValue(data.message);
        console.log("message 84", decMessage);
        console.log("data.user_pk 84", data.user_pk);
        let encMessage = oaep.encryptValue(decMessage)//, data.to_user_pk); // this public key will come from FE
        data.message = encMessage;
        console.log("message 87", data);
        socket.broadcast.to(data.room).emit('message', data);
    })
});
/* socket function ends */

server.listen(8082, function() {
    console.log("server started")
});