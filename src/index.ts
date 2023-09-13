import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import {Server} from 'socket.io'
import {instrument} from '@socket.io/admin-ui'
import mongoose from 'mongoose'
import router from './routes/route'
import keyRouter from './routes/tokenroute'
import {socketFunc} from './services/socket'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const DATABASE_URL = process.env.MONGODB_URL

app.use(bodyParser.json())
const httpServer = http.createServer(app)

app.use('/api/v1', router)
app.use('/keys/v1', keyRouter)

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:8082', 'https://admin.socket.io'],
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
  socketFunc(socket, io)
})

httpServer.listen(8082, () => {
  console.log('Server running on http://localhost:8082/')
})

mongoose.Promise = Promise
mongoose.connect(DATABASE_URL).then(() => {
  console.log('Connected to Mongodb.')
})
mongoose.connection.on('error', (error: Error) => console.log(error))
