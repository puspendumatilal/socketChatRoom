import {Request, Response} from 'express'
import * as helper from '../utils/helper'
import chatUserInfo from '../schema/chat_user_info'
import chatRoomParticipantInfoModel from '../schema/chat_room_participant_info'
import chatRoomInfoSchemaModel from '../schema/chat_room_info'
import chatUserSettingsSchemaModel from '../schema/chat_user_settings'
import * as customType from '../common/customreqtypes'
import {UserStatus} from '../common/enums'

export const addNewUserToChatlist = async function (
  req: Request,
  res: Response,
) {
  try {
    const rawbody: customType.AddUserReq =
      helper.parseJSON<customType.AddUserReq>(`${req.body}`)
    const userId = rawbody.user_Id
    if (!rawbody.user_Id) {
      return res.send({status: 'error', message: 'user_Id is missing'})
    }
    if (!rawbody.user_Name) {
      return res.send({status: 'error', message: 'user_Name is missing'})
    }
    if (!rawbody.user_Role) {
      return res.send({status: 'error', message: 'user_Role is missing'})
    }
    const userData = await chatUserInfo.findOne({user_id: userId})
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
      // add user to settings table
      new chatUserSettingsSchemaModel({
        user_id: rawbody.user_Id,
        chat_user_id: user.id,
      }).save()
      return res.send({status: 'success', message: 'User added', data: user})
    } else {
      return res.send({
        status: 'success',
        message: 'User already present',
        data: userData,
      })
    }
  } catch (error) {
    return res.send({status: 'error', message: 'Cannot add user', data: error})
  }
}

export const getOnlineUsers = async function (req: Request, res: Response) {
  try {
    const userData = await chatUserInfo.find({
      user_online: true,
      user_status: UserStatus.ACTIVE,
    })
    return res.send({status: 'success', message: 'Users found', data: userData})
  } catch (error) {
    return res.send({status: 'error', message: 'Error', data: error})
  }
}

export const getChatRoomsByUser = async function (req: Request, res: Response) {
  try {
    const rawbody: customType.GetChatRoomsByUserReq =
      helper.parseJSON<customType.GetChatRoomsByUserReq>(`${req.body}`)
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
      return res.send({
        status: 'success',
        message: 'Data found',
        data: roomDatas,
      })
    }
    return res.send({status: 'error', message: 'No data found'})
  } catch (error) {
    return res.send({status: 'error', message: 'error'})
  }
}
