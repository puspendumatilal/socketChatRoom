import mongoose, {Document, Model, Schema} from 'mongoose'

interface IChatBackup extends Document {
  room_name: string
  room_type: string
  chat_backup_json_string: string
  org_name: string
  chat_room_Id: string
  createdAt: Date
  updatedAt: Date
}

const chatBackupSchema: Schema<IChatBackup> = new mongoose.Schema(
  {
    room_name: {
      type: String,
      required: [true, 'room_name is required.'],
      trim: true,
    },
    room_type: {
      type: String,
      required: [true, 'room_type is required.'],
      trim: true,
    },
    chat_backup_json_string: {
      type: String,
      required: [true, 'chat_backup_json_string is required.'],
      trim: true,
    },
    org_name: {
      type: String,
      required: [true, 'org_name is required.'],
      trim: true,
    },
    chat_room_Id: {
      type: String,
      required: [true, 'chat_room_Id is required.'],
      trim: true,
    },
  },
  {
    collection: 'chat_backup',
    timestamps: true,
  },
)

const chatBackupModel: Model<IChatBackup> = mongoose.model<IChatBackup>(
  'chatBackupModel',
  chatBackupSchema,
)

export default chatBackupModel
