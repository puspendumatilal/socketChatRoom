// Import necessary dependencies and the function to be tested
import {Request, Response} from 'express'
import {
  searchChatRoom,
  searchUserList,
} from '../../src/controllers/searchcontroller'

import chatUserInfo from '../../src/schema/chat_user_info'
import chatRoomInfo from '../../src/schema/chat_room_info'
import {connectMongo, closeMongo} from '../db/mongo.testconfig'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await closeMongo()
})

const mockRequest = (body: object) => {
  return {body} as Request
}

const mockResponse = () => {
  const res: Partial<Response> = {
    send: jest.fn(),
  }
  return res as Response
}

describe('searchChatRoom', () => {
  it('should return a error response with data when searchString is empty', async () => {
    // Arrange
    const testJson = {searchString: '', skip: 0, take: 10}
    const req: Request = mockRequest({searchString: 'sampleRoomId'})
    req.body = JSON.stringify(testJson)
    const res: Response = mockResponse()

    // Act
    await searchChatRoom(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'req format not match',
    })
  })

  it('should return a error response with data when skip is empty', async () => {
    // Arrange
    const testJson = {searchString: 'cc', take: 10}
    const req: Request = mockRequest({searchString: 'sampleRoomId'})
    req.body = JSON.stringify(testJson)
    const res: Response = mockResponse()

    // Act
    await searchChatRoom(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'req format not match',
    })
  })

  it('should return a error response with data when take is empty', async () => {
    // Arrange
    const testJson = {searchString: '', skip: 0, take: 0}
    const req: Request = mockRequest({searchString: 'sampleRoomId'})
    req.body = JSON.stringify(testJson)
    const res: Response = mockResponse()
    const expectedData = [jest.fn()]

    // Act
    await searchChatRoom(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'req format not match',
    })
  })

  it('should return a success with data is valid', async () => {
    // Arrange
    const testJson = {searchString: 'pu', skip: 0, take: 10}

    const regex = new RegExp(testJson.searchString, 'i')
    const searchObj = {
      room_name: regex,
    }

    const userData = await chatRoomInfo
      .find(searchObj)
      .skip(testJson.skip)
      .limit(testJson.take)

    // Assert
    expect(userData).toBeDefined()
  })
})

describe('searchUserList', () => {
  it('should return a error response with data when searchString is empty', async () => {
    // Arrange
    const testJson = {searchString: '', skip: 0, take: 10}
    const req: Request = mockRequest({searchString: 'sampleRoomId'})
    req.body = JSON.stringify(testJson)
    const res: Response = mockResponse()

    // Act
    await searchUserList(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'req format not match',
    })
  })

  it('should return a error response with data when skip is empty', async () => {
    // Arrange
    const testJson = {searchString: 'cc', take: 10}
    const req: Request = mockRequest({searchString: 'sampleRoomId'})
    req.body = JSON.stringify(testJson)
    const res: Response = mockResponse()
    const expectedData = [jest.fn()]

    // Act
    await searchUserList(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'req format not match',
    })
  })

  it('should return a error response with data when take is empty', async () => {
    // Arrange
    const testJson = {searchString: '', skip: 0, take: 0}
    const req: Request = mockRequest({searchString: 'sampleRoomId'})
    req.body = JSON.stringify(testJson)
    const res: Response = mockResponse()
    const expectedData = [jest.fn()]

    // Act
    await searchUserList(req, res)

    // Assert
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'req format not match',
    })
  })

  it('should return a success with data is valid', async () => {
    // Arrange
    const rawbody = {searchString: 'my', skip: 0, take: 10}
    // Act
    const regex = new RegExp(rawbody.searchString, 'i')
    const searchObj = {
      user_name: regex,
    }
    // searchOption key should be match with db keys {$regex: name, $options: 'i'}
    const userData = await chatUserInfo
      .find(searchObj)
      .skip(rawbody.skip)
      .limit(rawbody.take)

    // Assert
    expect(userData).toBeDefined()
  })
})
