import {Request, Response} from 'express'
import * as helper from '../utils/helper'
import chatBackupModel from '../schema/chat_backup'
import chatRoomModel from '../schema/chat_room_info'
import chatLog from '../schema/chat-event-logs'
import chatRoomParticipant from '../schema/chat_room_participant_info'
import {ParticipantStatus, RoomTypeEnum} from '../common/enums'
import * as customType from '../common/customreqtypes'

export const initChat = async (req: Request, res: Response) => {
  try {
    const rawbody: customType.InitChatReq =
      helper.parseJSON<customType.InitChatReq>(`${req.body}`)
    if (
      rawbody.roomType === RoomTypeEnum.PRIVATE &&
      rawbody.privategroupidlist.length == 0
    ) {
      return res.send({status: 'error', message: 'privategroupidlist missing'})
    }
    if (!rawbody.roomName) {
      return res.send({status: 'error', message: 'roomName is missing'})
    }
    if (!rawbody.roomType) {
      return res.send({status: 'error', message: 'roomType is missing'})
    }
    if (!rawbody.created_by) {
      return res.send({status: 'error', message: 'created_by is missing'})
    }
    if (!rawbody.org) {
      return res.send({status: 'error', message: 'org is missing'})
    }
    if (!rawbody.owner.userId) {
      return res.send({status: 'error', message: 'owner userId is missing'})
    }
    if (!rawbody.owner.username) {
      return res.send({status: 'error', message: 'owner username is missing'})
    }
    if (!rawbody.owner.role) {
      return res.send({status: 'error', message: 'owner role is missing'})
    }
    if (rawbody.participant.length === 0) {
      return res.send({status: 'error', message: 'participant is missing'})
    }
    const chatroomInfoData = await new chatRoomModel({
      room_name: rawbody.roomName,
      room_type: rawbody.roomType,
      created_by: rawbody.created_by,
      org_name: rawbody.org,
      concent_for_reading_chat: rawbody.concent,
      concent_given_by_user: rawbody.concent_user,
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

    return res.send({
      status: 'success',
      roomInfo: chatroomInfoData,
      userData: userParticipateData,
      participant_list: userParticipateDataList,
    })
  } catch (error) {
    return res.send({status: 'error', data: error})
  }
}

export const backupChat = async (req: Request, res: Response) => {
  try {
    const rawbody: customType.BackupChatReq =
      helper.parseJSON<customType.BackupChatReq>(`${req.body}`)
    const {roomName, roomType, backupJson, org, roomId} = rawbody
    if (helper.isEmpty(roomType))
      return res.send({status: 'error', message: 'room type missing'})
    if (helper.isEmpty(backupJson))
      return res.send({status: 'error', message: 'backupJson missing'})
    if (helper.isEmpty(org))
      return res.send({status: 'error', message: 'org missing'})
    if (helper.isEmpty(roomId))
      return res.send({status: 'error', message: 'roomId missing'})
    if (helper.isEmpty(roomName))
      return res.send({status: 'error', message: 'roomName missing'})

    const data = await new chatBackupModel({
      room_name: roomName,
      room_type: roomType,
      chat_backup_json_string: backupJson,
      org_name: org,
      chat_room_Id: roomId,
    }).save()
    if (data) {
      return res.send({
        status: 'success',
        message: 'backup successful',
        data: data,
      })
    } else {
      return res.send({status: 'error', message: 'backup errored'})
    }
  } catch (error) {
    return res.send({status: 'error', message: 'error', data: error})
  }
}

export const getBackupChat = async (req: Request, res: Response) => {
  try {
    const rawbody: customType.GetBackupChatReq =
      helper.parseJSON<customType.GetBackupChatReq>(`${req.body}`)
    const {roomId} = rawbody
    if (helper.isEmpty(roomId))
      return res.send({status: 'error', message: 'roomId missing'})

    const data = await chatBackupModel.find({chat_room_Id: roomId})
    if (data.length > 0) {
      return res.send({
        status: 'success',
        message: 'Fetch successful',
        data: data,
      })
    } else {
      return res.send({status: 'error', message: 'no data found'})
    }
  } catch (error) {
    return res.send({status: 'error', message: 'error'})
  }
}
