import mongoose, {Document, Model, Schema} from 'mongoose'

interface IChatEventLogs extends Document {
  chat_room_Id: string
  org_name: string
  event_log_string: string
  additional_data: string
  createdAt: Date
  updatedAt: Date
}

const chatEventLogsSchema: Schema<IChatEventLogs> = new mongoose.Schema(
  {
    chat_room_Id: {
      type: String,
      required: [true, 'chat_room_Id is required.'],
      trim: true,
    },
    org_name: {
      type: String,
      trim: true,
    },
    event_log_string: {
      type: String,
      required: [true, 'event_log_string is required.'],
      trim: true,
    },
    additional_data: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'chat_event_logs',
    timestamps: true,
  },
)

const chatEventLogsModel: Model<IChatEventLogs> =
  mongoose.model<IChatEventLogs>('chatEventLogsModel', chatEventLogsSchema)

export default chatEventLogsModel
