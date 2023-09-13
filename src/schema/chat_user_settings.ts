import mongoose, {Document, Model, Schema} from 'mongoose'
import {ThemePreference} from '../common/enums'

interface IChatUserSettings extends Document {
  user_id: string
  chat_user_id: string
  theme_preference: string
  notification_sound: boolean
  notification_banner: boolean
  createdAt: Date
  updatedAt: Date
}

const chatUserSettingsSchema: Schema<IChatUserSettings> = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'user_id is required.'],
      trim: true,
    },
    chat_user_id: {
      type: String,
      required: [true, 'chat_user_id is required.'],
      trim: true,
    },
    theme_preference: {
      type: String,
      default: ThemePreference.LIGHT,
      enum: Object.values(ThemePreference),
    },
    notification_banner: {
      type: Boolean,
      default: true,
    },
    notification_sound: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: 'chat_user_settings',
    timestamps: true,
  },
)

const chatUserSettingsSchemaModel: Model<IChatUserSettings> =
  mongoose.model<IChatUserSettings>(
    'chatUserSettingsSchemaModel',
    chatUserSettingsSchema,
  )

export default chatUserSettingsSchemaModel
