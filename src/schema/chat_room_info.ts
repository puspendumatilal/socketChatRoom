import mongoose, {Document, Model, Schema} from 'mongoose'
import {RoomTypeEnum} from '../common/enums'

interface IChatRoomInfo extends Document {
  room_name: string
  room_type: string
  created_by: string
  org_name: string
  concent_for_reading_chat: boolean
  concent_given_by_user: string
  private_group_user_ids: string[]
  createdAt: Date
  updatedAt: Date
}

// room_name convension:
// Single: username1-username2
// Public: PUBLIC_<CREATORNAME>_<RANDOM-4>
// Private: PRIVATE_<CREATORNAME>_<RANDOM-4>

const chatRoomInfoSchema: Schema<IChatRoomInfo> = new mongoose.Schema(
  {
    room_name: {
      type: String,
      required: [true, 'room_name is required.'],
      trim: true,
    },
    room_type: {
      type: String,
      required: [true, 'room_type is required.'],
      enum: Object.values(RoomTypeEnum),
      trim: true,
    },
    created_by: {
      type: String,
      required: [true, 'created_by is required.'],
      trim: true,
    },
    org_name: {
      type: String,
      required: [true, 'org_name is required.'],
      trim: true,
    },
    concent_for_reading_chat: {
      type: Boolean,
      default: false,
      trim: true,
    },
    concent_given_by_user: {
      type: String,
      trim: true,
      default: '',
    },
    private_group_user_ids: {
      type: [String],
      default: [],
    },
  },
  {
    collection: 'chat_room_info',
    timestamps: true,
  },
)

const chatRoomInfoSchemaModel: Model<IChatRoomInfo> =
  mongoose.model<IChatRoomInfo>('chatRoomInfoSchemaModel', chatRoomInfoSchema)

export default chatRoomInfoSchemaModel
