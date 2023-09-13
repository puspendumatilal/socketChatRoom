import chatRoomModel from '../schema/chat_room_info'
import chatRoomParticipantInfoModel from '../schema/chat_room_participant_info'
import * as helper from '../utils/helper'
import chatLog from '../schema/chat-event-logs'
import chatUserInfo from '../schema/chat_user_info'

export const verifyPrivateRoomMember = async (data: any) => {
  try {
    const roomId = data.room.id
    const roomData = await chatRoomModel.findById(roomId)
    if (helper.isEmpty(roomData)) {
      return false
    }
    const newArr = roomData.private_group_user_ids.filter((ids) => {
      return ids === data.user_Id
    })
    if (newArr.length > 0) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

export const changeUserParticipationStatus = async (data: any) => {
  try {
    const roomId = data.room.id
    const participantInfoArr: any = await chatRoomParticipantInfoModel.find({
      chat_room_Id: roomId,
      user_Id: data.user_Id,
    })

    const participantInfo = participantInfoArr[0]

    await new chatLog({
      chat_room_Id: roomId,
      event_log_string: data.event + ' event performed',
      additional_data: JSON.stringify(data),
    }).save()

    if (!helper.isEmpty(participantInfo)) {
      if (data.user_blocked_by)
        participantInfo.user_blocked_by = data.user_blocked_by
      if (data.user_removed_by)
        participantInfo.user_removed_by = data.user_removed_by
      participantInfo.participant_status = data.participantstatus
      await participantInfo.save()
      return true
    }
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}

export const updateUserOnlineOffline = async (data: any) => {
  try {
    const roomId = data.room.id
    const userInfoArr: any = await chatUserInfo.find({
      user_id: data.user_Id,
    })

    const userInfo = userInfoArr[0]

    await new chatLog({
      chat_room_Id: roomId,
      event_log_string: data.event + ' event performed',
      additional_data: JSON.stringify(data),
    }).save()

    if (!helper.isEmpty(userInfo)) {
      userInfo.user_online = data.user_Online
      await userInfo.save()
      return true
    }
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}
