// Import necessary dependencies and the function to be tested
import {Request, Response} from 'express'
import {getToken} from '../../src/controllers/auth.controller'
const mockRequest = (body: object) => {
  return {body} as Request
}

const mockResponse = () => {
  const res: Partial<Response> = {
    send: jest.fn(),
  }
  return res as Response
}

describe('getToken', () => {
  it('should return a error response when user_Id is not exist', async () => {
    const req: Request = mockRequest({user_Id: '0000'})
    req.body = {user_Id: '0000'}
    const res: Response = mockResponse()
    await getToken(req, res)

    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'user not found',
    })
  })
})
