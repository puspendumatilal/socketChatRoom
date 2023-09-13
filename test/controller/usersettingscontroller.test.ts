// Import necessary dependencies and the function to be tested
import {Request, Response} from 'express'
import {
  updateNotificationSettings,
  updateThemePreference,
} from '../../src/controllers/usersettingscontroller'
import * as helper from '../../src/utils/helper'
import chatUserInfo from '../../src/schema/chat_user_info'

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

describe('updateNotificationSettings', () => {
  it('should return a error response when user_Id is not exist', async () => {
    // Arrange
    const rawbody = {
      user_Id: '3333',
      notification_banner: true,
      notification_sound: true,
    }
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    const userData = await chatUserInfo.findOne({user_id: rawbody.user_Id})

    if (helper.isEmpty(userData)) {
      await updateNotificationSettings(req, res)

      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'user not found',
      })
    }
  })

  it('should return a error response when user_Id is not exist', async () => {
    // Arrange
    const rawbody = {
      user_Id: '2233',
      notification_banner: true,
      notification_sound: true,
    }
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    let userData: any = await chatUserInfo.findOne({user_id: rawbody.user_Id})

    if (helper.isEmpty(userData)) {
      await updateNotificationSettings(req, res)

      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'user not found',
      })
    } else {
      userData = userData[0]
      if (rawbody.hasOwnProperty('notification_banner'))
        userData.notification_banner = rawbody.notification_banner
      if (rawbody.hasOwnProperty('notification_sound'))
        userData.notification_sound = rawbody.notification_sound
      await userData.save()
      await updateNotificationSettings(req, res)
      expect(res.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'settings updated',
        data: userData,
      })
    }
  })

  it('should return a error response when exception occurs', async () => {
    // Arrange
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    const res: Response = mockResponse()

    await updateNotificationSettings(req, res)

    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'Error',
    })
  })
})

describe('updateThemePreference', () => {
  it('should return a error response when user_Id is not exist', async () => {
    // Arrange
    const rawbody = {
      user_Id: '3333',
      theme: 'Light',
    }
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    const userData = await chatUserInfo.findOne({user_id: rawbody.user_Id})

    if (helper.isEmpty(userData)) {
      await updateThemePreference(req, res)

      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'user not found',
      })
    }
  })

  it('should return a error response when user_Id is not exist', async () => {
    // Arrange
    const rawbody = {
      user_Id: '2233',
      theme: 'Light',
    }
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    req.body = JSON.stringify(rawbody)
    const res: Response = mockResponse()

    let userData: any = await chatUserInfo.findOne({user_id: rawbody.user_Id})

    if (helper.isEmpty(userData)) {
      await updateThemePreference(req, res)

      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'user not found',
      })
    } else {
      userData = userData[0]
      if (rawbody.theme) userData.theme_preference = rawbody.theme
      await userData.save()
      await updateNotificationSettings(req, res)
      expect(res.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'settings updated',
        data: userData,
      })
    }
  })

  it('should return a error response when exception occurs', async () => {
    // Arrange
    const req: Request = mockRequest({roomId: 'sampleRoomId'})
    const res: Response = mockResponse()

    await updateThemePreference(req, res)

    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'Error',
    })
  })
})
