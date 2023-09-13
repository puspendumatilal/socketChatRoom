import {Socket} from 'socket.io'
import * as hmac from '../middleware/hmacAuth'
import * as socketHelper from '../utils/socket_helper'
import {RoomTypeEnum} from '../common/enums'

// online user using mongo realtime

type myObj = {
  userId: String
  socket: Socket
}

let clientSocketIds: myObj[] = []
let connectedUsers: string[] = [] // array of socket id

const getSocketByUserId = (userId: String) => {
  let socket: Socket = null
  for (let i = 0; i < clientSocketIds.length; i++) {
    if (clientSocketIds[i].userId == userId) {
      socket = clientSocketIds[i].socket
      break
    }
  }
  return socket
}

/* socket function starts */
export const socketFunc = (socket: Socket, io: any) => {
  console.log('conected')
  socket.on('disconnect', () => {
    console.log('disconnected')
    connectedUsers = connectedUsers.filter((item) => item != socket.id)
    io.emit('updateUserList', connectedUsers)
  })

  console.log('connected user ==>>', connectedUsers.length)

  socket.on('createpublicroom', async function (data) {
    console.log('createpublicroom', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.join(data.room.id)
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
    }
  })

  socket.on('createprivateroom', async function (data) {
    console.log('createprivateroom', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.join(data.room.id)
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('create', async function (data) {
    console.log(socket.id)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    console.log('create', data)
    if (isAuthenticated) {
      socket.join(data.room.id)
      // socket.broadcast.to(data.room.id).emit('data', data)
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('joinRoom', async function (data) {
    console.log('joinRoom', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      if (data.room.type === RoomTypeEnum.PRIVATE) {
        if (socketHelper.verifyPrivateRoomMember(data)) {
          socket.join(data.room.id)
        } else {
          socket.broadcast
            .to(data.room.id)
            .emit(
              'authentication',
              'Authentication Fails, you are not allowed to enter this room',
            )
        }
      }
      socket.join(data.room.id)
      socket.broadcast.to(data.room.id).emit('data', data)
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('message', async function (data) {
    console.log('message', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.broadcast.to(data.room.id).emit('data', data)
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('online', async function (data) {
    console.log('online', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socketHelper.updateUserOnlineOffline(data)
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('typing', async function (data) {
    console.log('typing', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.broadcast.to(data.room.id).emit('data', data)
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('read', async function (data) {
    console.log('read', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.broadcast.to(data.room.id).emit('data', data)
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('offline', async function (data) {
    console.log('offline', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      console.log('AUTN')
      // update online user list when someone is offline
      socketHelper.updateUserOnlineOffline(data)
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('userLeft', async function (data) {
    console.log(socket.id)
    console.log('create', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.broadcast.to(data.room.id).emit('data', data)
      if (!socketHelper.changeUserParticipationStatus(data)) {
        console.log('Socket fails for USERLEFT - ', data)
      }
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('userRemoved', async function (data) {
    console.log(socket.id)
    console.log('create', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.broadcast.to(data.room.id).emit('data', data)
      if (!socketHelper.changeUserParticipationStatus(data)) {
        console.log('Socket fails for USERREMOVED - ', data)
      }
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('Declined', async function (data) {
    console.log(socket.id)
    console.log('create', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.broadcast.to(data.room.id).emit('data', data)
      if (!socketHelper.changeUserParticipationStatus(data)) {
        console.log('Socket fails for USER Declined - ', data)
      }
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('Accepted', async function (data) {
    console.log(socket.id)
    console.log('create', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.broadcast.to(data.room.id).emit('data', data)
      if (!socketHelper.changeUserParticipationStatus(data)) {
        console.log('Socket fails for USER Accepted - ', data)
      }
    } else {
      console.log('ERROR CASE')
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })

  socket.on('Blocked', async function (data) {
    console.log(socket.id)
    console.log('create', data)
    const isAuthenticated = await hmac.verifySocketHmac(socket)
    if (isAuthenticated) {
      socket.broadcast.to(data.room.id).emit('data', data)
      socket.leave(data.room.id)
      if (!socketHelper.changeUserParticipationStatus(data)) {
        console.log('Socket fails for USER BLOCKED - ', data)
      }
    } else {
      socket.broadcast
        .to(data.room.id)
        .emit('authentication', 'Authentication Fails')
      socket.disconnect(true)
    }
  })
}
/* socket function ends */
