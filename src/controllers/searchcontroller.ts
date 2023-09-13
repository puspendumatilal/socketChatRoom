import {Request, Response} from 'express'
import * as helper from '../utils/helper'
import chatUserInfo from '../schema/chat_user_info'
import chatRoomInfo from '../schema/chat_room_info'
import * as customType from '../common/customreqtypes'

export const searchChatRoom = async function (req: Request, res: Response) {
  try {
    const rawbody: customType.SearchReq =
      helper.parseJSON<customType.SearchReq>(`${req.body}`)
    if (!rawbody.hasOwnProperty('skip'))
      return res.send({status: 'error', message: 'req format not match'})
    if (helper.isEmpty(rawbody.take))
      return res.send({status: 'error', message: 'req format not match'})
    if (helper.isEmpty(rawbody.searchString))
      return res.send({status: 'error', message: 'req format not match'})
    const regex = new RegExp(rawbody.searchString, 'i')
    const searchObj = {
      room_name: regex,
    }
    // searchOption key should be match with db keys
    const userData = await chatRoomInfo
      .find(searchObj)
      .skip(rawbody.skip)
      .limit(rawbody.take)
    return res.send({
      status: 'success',
      message: 'Fetch successful',
      data: userData,
    })
  } catch (error) {
    return res.send({status: 'error', message: 'Error', data: error})
  }
}

export const searchUserList = async function (req: Request, res: Response) {
  try {
    const rawbody: customType.SearchReq =
      helper.parseJSON<customType.SearchReq>(`${req.body}`)
    if (!rawbody.hasOwnProperty('skip'))
      return res.send({status: 'error', message: 'req format not match'})
    if (helper.isEmpty(rawbody.take))
      return res.send({status: 'error', message: 'req format not match'})
    if (helper.isEmpty(rawbody.searchString))
      return res.send({status: 'error', message: 'req format not match'})
    const regex = new RegExp(rawbody.searchString, 'i')
    const searchObj = {
      user_name: regex,
    }
    // searchOption key should be match with db keys {$regex: name, $options: 'i'}
    const userData = await chatUserInfo
      .find(searchObj)
      .skip(rawbody.skip)
      .limit(rawbody.take)
    return res.send({status: 'success', message: 'User found', data: userData})
  } catch (error) {
    return res.send({status: 'error', message: 'Error', data: error})
  }
}
