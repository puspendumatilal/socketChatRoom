import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import {Server} from 'socket.io'
import {instrument} from '@socket.io/admin-ui'
import mongoose from 'mongoose'
import router from './routes/route'

const app = express()
const DATABASE_URL =
  'mongodb+srv://puspendumatilal:i51jYlkHF5K5WL0l@cluster0.hzmt4kg.mongodb.net/iSyncChat?retryWrites=true&w=majority'

app.use(bodyParser.json())
const httpServer = http.createServer(app)

app.use('/api/v1', router)
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:8085', 'https://admin.socket.io'],
  },
})

instrument(io, {
  auth: false,
})

io.use((socket, next) => {
  console.log('any auth here =====>>>', socket.handshake.headers)
  next()
}).on('connection', (socket) => {
  console.log('socket io connected successfully. ===')
  // SocketServer.socketFunc(socket, io);
})

httpServer.listen(8085, () => {
  console.log('Server running on http://localhost:8085/')
})

mongoose.Promise = Promise
mongoose.connect(DATABASE_URL).then(() => {
  console.log('Connected to Mongodb.')
})
mongoose.connection.on('error', (error: Error) => console.log(error))
