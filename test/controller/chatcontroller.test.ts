// Import necessary dependencies and the function to be tested
import {Request, Response} from 'express'
import {
  getBackupChat,
  backupChat,
  initChat,
} from '../../src/controllers/chatcontroller'

import chatBackupModel from '../../src/schema/chat_backup'
import chatRoomModel from '../../src/schema/chat_room_info'
import chatLog from '../../src/schema/chat-event-logs'
import chatRoomParticipant from '../../src/schema/chat_room_participant_info'
import {ParticipantStatus} from '../../src/common/enums'

import {connectMongo, closeMongo} from '../db/mongo.testconfig'

const mockRequest = (body: object) => {
  return {body} as Request
}

const mockResponse = () => {
  const res: Partial<Response> = {
    send: jest.fn(),
  }
  return res as Response
}

beforeAll(async () => {
  console.log('HERE 32')
  await connectMongo()
  console.log('HERE 34')
})

afterAll(async () => {
  await closeMongo()
})

describe('getBackupChat', () => {
  it('should return a successful response with data when roomId is provided ACTUAL MONGO DATA', async () => {
    // Arrange
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify({roomId: '64e2e689f9f1a9c9ae5dfe28'})
    const res: Response = mockResponse()
    console.log('HERE 40')
    const bodyData = {roomId: '64e2e689f9f1a9c9ae5dfe28'}
    const expectedData = await chatBackupModel.find({
      chat_room_Id: bodyData.roomId,
    })

    await getBackupChat(req, res)

    console.log(expectedData)
    expect(expectedData).toBeDefined()

    expect(res.send).toHaveBeenCalledWith({
      status: 'success',
      message: 'Fetch successful',
      data: expectedData,
    })
  })

  it('should return an error response when roomId is missing', async () => {
    // Arrange
    const req: Request = mockRequest({})
    const res: Response = mockResponse()
    req.body = JSON.stringify({roomId: ''})

    // Act
    await getBackupChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'roomId missing',
    })
  })

  it('should return an error response when chatBackupModel.find returns no data', async () => {
    // Arrange
    const req: Request = mockRequest({roomId: 'nonexistentRoomId'})
    req.body = JSON.stringify({roomId: 'nonexistentRoomId'})
    const res: Response = mockResponse()

    // Act
    await getBackupChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'no data found',
    })
  })

  it('should return an error response when an exception is thrown', async () => {
    // Arrange
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    const res: Response = mockResponse()

    // Act
    await getBackupChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'error',
    })
  })
})

describe('backupChat', () => {
  it('should return a error response with data when roomId is missing', async () => {
    // Arrange
    const rawbody = {
      roomId: '',
      org: 'sampleOrg',
      backupJson: 'backupJson',
      roomType: 'sampleRoomType',
      roomName: 'sampleRoomName',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await backupChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'roomId missing',
    })
  })

  it('should return a error response with data when org is missing', async () => {
    // Arrange
    const rawbody = {
      roomId: 'roomId',
      org: '',
      backupJson: 'backupJson',
      roomType: 'sampleRoomType',
      roomName: 'sampleRoomName',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await backupChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'org missing',
    })
  })

  it('should return a error response with data when backupJson is missing', async () => {
    // Arrange
    const rawbody = {
      roomId: 'roomId',
      org: 'org',
      backupJson: '',
      roomType: 'sampleRoomType',
      roomName: 'sampleRoomName',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await backupChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'backupJson missing',
    })
  })

  it('should return a error response with data when room type is missing', async () => {
    // Arrange
    const rawbody = {
      roomId: 'roomId',
      org: 'org',
      backupJson: 'json',
      roomType: '',
      roomName: 'sampleRoomName',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await backupChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'room type missing',
    })
  })

  it('should return a error response with data when room type is missing', async () => {
    // Arrange
    const rawbody = {
      roomId: 'roomId',
      org: 'org',
      backupJson: 'json',
      roomType: 'type',
      roomName: '',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await backupChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'roomName missing',
    })
  })

  it('should return a success response with proper data', async () => {
    // Arrange
    const rawbody = {
      roomId: 'myTestRoomId',
      org: 'org',
      backupJson: 'json',
      roomType: 'Private',
      roomName: 'roomName',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await backupChat(req, res)

    expect(res.send).toBeCalled()
  })
})

describe('initChat', () => {
  it('should check all data saved properly in database', async () => {
    // Arrange
    const rawbody = {
      roomType: 'Private',
      roomName: 'myPrivateGroup',
      privategroupidlist: ['2343', '8879'],
      owner: {
        concent: false,
        org: 'abc org',
        username: 'Puspendu',
        role: 'Admin',
        userId: '1234',
        userimage: 'userImg.jpg',
      },
      participant: [
        {
          username: 'username',
          role: 'CREW',
          userId: '2343',
          org: 'abc org',
        },
      ],
      created_by: '1234',
      org: 'abc org',
    }

    const chatroomInfoData = await new chatRoomModel({
      room_name: rawbody.roomName,
      room_type: rawbody.roomType,
      created_by: rawbody.created_by,
      org_name: rawbody.org,
      private_group_user_ids: rawbody.privategroupidlist,
    }).save()
    const chatlogData = new chatLog({
      chat_room_Id: chatroomInfoData.id,
      event_log_string: 'Room CREATED by ' + rawbody.created_by,
      org_name: rawbody.org,
      additional_data: JSON.stringify(rawbody),
    }).save()
    const date = new Date()
    const userParticipateData = await new chatRoomParticipant({
      user_Id: rawbody.owner.userId,
      user_name: rawbody.owner.username,
      user_image: rawbody.owner.userimage,
      user_role: rawbody.owner.role,
      joined_chatroom_at: date.toISOString(),
      chat_room_Id: chatroomInfoData.id,
      org_name: rawbody.owner.org,
      participant_status: ParticipantStatus.OWNER,
    }).save()
    const participantArr = rawbody.participant.map((data: any) => {
      let obj = {
        participant_status: ParticipantStatus.INVITED,
        user_name: data.username,
        user_role: data.role,
        chat_room_Id: chatroomInfoData.id,
        org_name: data.org,
        user_Id: data.userId,
        user_Invited_By: rawbody.owner.userId,
      }
      return obj
    })
    const userParticipateDataList = await chatRoomParticipant.insertMany(
      participantArr,
    )

    expect(participantArr).toBeDefined()
    expect(userParticipateData).toBeDefined()
    expect(userParticipateDataList).toBeDefined()
  })

  it('should check all data saved properly and called initchat function', async () => {
    // Arrange
    const rawbody = {
      roomType: 'Private',
      roomName: 'myPrivateGroup',
      privategroupidlist: ['2343', '8879'],
      owner: {
        concent: false,
        org: 'abc org',
        username: 'Puspendu',
        role: 'Admin',
        userId: '1234',
        userimage: 'userImg.jpg',
      },
      participant: [
        {
          username: 'username',
          role: 'CREW',
          userId: '2343',
          org: 'abc org',
        },
      ],
      created_by: '1234',
      org: 'abc org',
    }

    const req: Request = mockRequest(rawbody)
    rawbody.privategroupidlist = []
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await initChat(req, res)

    expect(res.send).toBeDefined()
  })

  it('should return a error response when privategroupidlist missing', async () => {
    // Arrange
    const rawbody = {
      roomType: 'Private',
      roomName: 'myPrivateGroup',
      privategroupidlist: ['2343'],
      owner: {
        concent: false,
        org: 'abc org',
        username: 'Puspendu',
        role: 'Admin',
        userId: '1234',
      },
      participant: [
        {
          username: 'username',
          role: 'CREW',
          userId: '2343',
          org: 'abc org',
        },
      ],
      created_by: '1234',
      org: 'abc org',
    }
    const req: Request = mockRequest(rawbody)
    rawbody.privategroupidlist = []
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await initChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'privategroupidlist missing',
    })
  })

  it('should return a error response when roomName missing', async () => {
    // Arrange
    const rawbody = {
      roomType: 'Private',
      roomName: '',
      privategroupidlist: ['2343', '8879'],
      owner: {
        concent: false,
        org: 'abc org',
        username: 'Puspendu',
        role: 'Admin',
        userId: '1234',
      },
      participant: [
        {
          username: 'username',
          role: 'CREW',
          userId: '2343',
          org: 'abc org',
        },
      ],
      created_by: '1234',
      org: 'abc org',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await initChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'roomName is missing',
    })
  })

  it('should return a error response when roomType missing', async () => {
    // Arrange
    const rawbody = {
      roomType: '',
      roomName: 'myPrivateGroup',
      privategroupidlist: ['2343', '8879'],
      owner: {
        concent: false,
        org: 'abc org',
        username: 'Puspendu',
        role: 'Admin',
        userId: '1234',
      },
      participant: [
        {
          username: 'username',
          role: 'CREW',
          userId: '2343',
          org: 'abc org',
        },
      ],
      created_by: '1234',
      org: 'abc org',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await initChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'roomType is missing',
    })
  })

  it('should return a error response when created_by missing', async () => {
    // Arrange
    const rawbody = {
      roomType: 'Private',
      roomName: 'myPrivateGroup',
      privategroupidlist: ['2343', '8879'],
      owner: {
        concent: false,
        org: 'abc org',
        username: 'Puspendu',
        role: 'Admin',
        userId: '1234',
      },
      participant: [
        {
          username: 'username',
          role: 'CREW',
          userId: '2343',
          org: 'abc org',
        },
      ],
      created_by: '',
      org: 'abc org',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await initChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'created_by is missing',
    })
  })

  it('should return a error response when participant missing', async () => {
    // Arrange
    const rawbody: any = {
      roomType: 'Private',
      roomName: 'myPrivateGroup',
      privategroupidlist: ['2343', '8879'],
      owner: {
        concent: false,
        org: 'abc org',
        username: 'Puspendu',
        role: 'Admin',
        userId: '1234',
      },
      participant: [],
      created_by: '1234',
      org: 'abc org',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await initChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'participant is missing',
    })
  })

  it('should return a error response when owner role missing', async () => {
    // Arrange
    const rawbody = {
      roomType: 'Private',
      roomName: 'myPrivateGroup',
      privategroupidlist: ['2343', '8879'],
      owner: {
        concent: false,
        org: 'abc org',
        username: 'Puspendu',
        role: '',
        userId: '1234',
      },
      participant: [
        {
          username: 'username',
          role: 'CREW',
          userId: '2343',
          org: 'abc org',
        },
      ],
      created_by: '1234',
      org: 'abc org',
    }
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    // Act
    await initChat(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'owner role is missing',
    })
  })
})
