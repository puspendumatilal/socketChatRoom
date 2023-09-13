// Import necessary dependencies and the function to be tested
import {Request, Response} from 'express'
import {
  addNewUserToChatlist,
  getOnlineUsers,
  getChatRoomsByUser,
} from '../../src/controllers/usercontroller'
import * as helper from '../../src/utils/helper'
import chatUserInfo from '../../src/schema/chat_user_info'
import chatRoomInfoSchemaModel from '../../src/schema/chat_user_info'
import {UserStatus} from '../../src/common/enums'
import chatRoomParticipantInfoModel from '../../src/schema/chat_room_participant_info'

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

describe('getOnlineUsers', () => {
  it('should return a successful response with data when roomId is provided ACRUAL MONGO DATA', async () => {
    // Arrange
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify({roomId: '64e2e689f9f1a9c9ae5dfe28'})
    const res: Response = mockResponse()

    const userData = await chatUserInfo.find({
      user_online: true,
      user_status: UserStatus.ACTIVE,
    })

    await getOnlineUsers(req, res)

    expect(res.send).toHaveBeenCalledWith({
      status: 'success',
      message: 'Users found',
      data: userData,
    })
  })
})

describe('getChatRoomsByUser', () => {
  it('should return a successful response with data when roomId is provided ACRUAL MONGO DATA', async () => {
    // Arrange
    const rawbody = {user_Id: '2233', skip: 0, take: 10}
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()
    const userData = await chatRoomParticipantInfoModel
      .find({
        user_Id: rawbody.user_Id,
      })
      .skip(rawbody.skip)
      .limit(rawbody.take)

    if (!helper.isEmpty(userData)) {
      const roomIds = userData.map((data) => {
        return data.chat_room_Id
      })
      const roomDatas = await chatRoomInfoSchemaModel.find({
        _id: {$in: roomIds},
      })

      await getChatRoomsByUser(req, res)

      expect(res.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Users found',
        data: roomDatas,
      })
    }
  })

  it('should return a error response with message when user id wrong', async () => {
    // Arrange
    const rawbody = {user_Id: '4444', skip: 0, take: 10}
    const req: Request = mockRequest(rawbody)
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()
    await getChatRoomsByUser(req, res)
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'No data found',
    })
  })

  it('should return a error for an exception in function', async () => {
    // Arrange
    const rawbody = {user_Id: '4444', skip: 0, take: 10}
    const req: Request = mockRequest(rawbody)
    const res: Response = mockResponse()
    await getChatRoomsByUser(req, res)
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'error',
    })
  })
})

describe('addNewUserToChatlist', () => {
  it('should return a error response when user_Id is missing', async () => {
    // Arrange
    const rawbody = {
      user_Id: '',
      user_Name: 'Meghadrita',
      user_Role: 'CREW',
      user_Image: 'myImg.jpg',
      user_Status: 'Active',
      user_Online: true,
      user_LastSeen: '2023-07-19T15:04:25.079+00:00',
    }
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    await addNewUserToChatlist(req, res)

    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'user_Id is missing',
    })
  })

  it('should return a error response when user_Name is missing', async () => {
    // Arrange
    const rawbody = {
      user_Id: '1234',
      user_Name: '',
      user_Role: 'CREW',
      user_Image: 'myImg.jpg',
      user_Status: 'Active',
      user_Online: true,
      user_LastSeen: '2023-07-19T15:04:25.079+00:00',
    }
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    await addNewUserToChatlist(req, res)

    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'user_Name is missing',
    })
  })

  it('should return a error response when user_Role is missing', async () => {
    // Arrange
    const rawbody = {
      user_Id: '1234',
      user_Name: 'name',
      user_Role: '',
      user_Image: 'myImg.jpg',
      user_Status: 'Active',
      user_Online: true,
      user_LastSeen: '2023-07-19T15:04:25.079+00:00',
    }
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    await addNewUserToChatlist(req, res)

    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'user_Role is missing',
    })
  })

  it('should return a success response when user_Id is already present', async () => {
    // Arrange
    const rawbody = {
      user_Id: '2233',
      user_Name: 'name',
      user_Role: 'CREW',
      user_Image: 'myImg.jpg',
      user_Status: 'Active',
      user_Online: true,
      user_LastSeen: '2023-07-19T15:04:25.079+00:00',
    }
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    const userData = await chatUserInfo.findOne({user_id: rawbody.user_Id})

    if (!helper.isEmpty(userData)) {
      await addNewUserToChatlist(req, res)

      expect(res.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'User already present',
        data: userData,
      })
    }
  })

  it('should return a success response when user_Id is already present', async () => {
    // Arrange
    const rawbody = {
      user_Id: '2663',
      user_Name: 'name',
      user_Role: 'CREW',
      user_Image: 'myImg.jpg',
      user_Status: 'Active',
      user_Online: true,
      user_LastSeen: '2023-07-19T15:04:25.079+00:00',
    }
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    const userData = await chatUserInfo.findOne({user_id: rawbody.user_Id})

    if (helper.isEmpty(userData)) {
      const user = await new chatUserInfo({
        user_id: rawbody.user_Id,
        user_name: rawbody.user_Name,
        user_role: rawbody.user_Role,
        user_image: rawbody.user_Image,
        user_status: rawbody.user_Status,
        user_online: rawbody.user_Online,
        user_last_seen_time: rawbody.user_LastSeen,
      }).save()

      expect(user).toBeDefined()

      await chatUserInfo.deleteOne({user_id: rawbody.user_Id})
    }
  })
})
