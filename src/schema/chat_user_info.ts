import mongoose, {Document, Model, Schema} from 'mongoose'
import {UserStatus} from '../common/enums'

interface IChatUserInfo extends Document {
  user_id: string
  user_name: string
  user_role: string
  user_image: string
  user_status: string
  user_online: boolean
  user_last_seen_time: Date
  createdAt: Date
  updatedAt: Date
}

const chatUserInfoSchema: Schema<IChatUserInfo> = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'user_id is required.'],
      trim: true,
    },
    user_name: {
      type: String,
      required: [true, 'user_name is required.'],
      trim: true,
    },
    user_role: {
      type: String,
      required: [true, 'user_role is required.'],
      trim: true,
    },
    user_image: {
      type: String,
      trim: true,
    },
    user_status: {
      type: String,
      trim: true,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    user_online: {
      type: Boolean,
      trim: true,
      default: true,
    },
    user_last_seen_time: {
      type: Date,
      trim: true,
    },
  },
  {
    collection: 'chat_user_info',
    timestamps: true,
  },
)

const chatUserInfoSchemaModel: Model<IChatUserInfo> =
  mongoose.model<IChatUserInfo>('chatUserInfoSchemaModel', chatUserInfoSchema)

export default chatUserInfoSchemaModel
