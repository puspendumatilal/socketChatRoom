import mongoose, {Document, Model, Schema} from 'mongoose'
import {ParticipantStatus} from '../common/enums'

interface IChatRoomParticipantInfo extends Document {
  user_Id: string
  user_Invited_By: string
  user_name: string
  user_image: string
  user_role: string
  joined_chatroom_at: string
  user_blocked_by: string
  user_removed_by: string
  chat_room_Id: string
  org_name: string
  participant_status: ParticipantStatus
  createdAt: Date
  updatedAt: Date
}

const chatRoomParticipantInfoSchema: Schema<IChatRoomParticipantInfo> =
  new mongoose.Schema(
    {
      user_Id: {
        type: String,
        required: [true, 'user_Id is required.'],
        trim: true,
      },
      user_Invited_By: {
        type: String,
        trim: true,
      },
      user_blocked_by: {
        type: String,
        trim: true,
      },
      user_removed_by: {
        type: String,
        trim: true,
      },
      user_name: {
        type: String,
        required: [true, 'user_name is required.'],
        trim: true,
      },
      user_image: {
        type: String,
        trim: true,
      },
      user_role: {
        type: String,
        required: [true, 'user_role is required.'],
        trim: true,
      },
      joined_chatroom_at: {
        type: String,
        trim: true,
      },
      chat_room_Id: {
        type: String,
        required: [true, 'chat_room_Id is required.'],
        trim: true,
      },
      org_name: {
        type: String,
        required: [true, 'org_name is required.'],
        trim: true,
      },
      participant_status: {
        type: String,
        enum: Object.values(ParticipantStatus),
        required: [true, 'participant_status is required.'],
        trim: true,
      },
    },
    {
      collection: 'chat_room_participant_info',
      timestamps: true,
    },
  )

const chatRoomParticipantInfoModel: Model<IChatRoomParticipantInfo> =
  mongoose.model<IChatRoomParticipantInfo>(
    'chatRoomParticipantInfoModel',
    chatRoomParticipantInfoSchema,
  )

export default chatRoomParticipantInfoModel

// participant_status: Owner/ Invited/ Accepted/ Declined/ Removed
