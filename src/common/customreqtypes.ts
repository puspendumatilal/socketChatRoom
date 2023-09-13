export type InitChatReq = {
  roomName: string
  roomType: string
  created_by: string
  org: string
  concent: string
  concent_user: string
  privategroupidlist: string[]
  owner: User
  participant: User[]
}

export type User = {
  concent: boolean
  org: string
  concent_user: string
  username: string
  role: string
  userId: string
  userimage: string
}

export type BackupChatReq = {
  roomId: string
  roomName: string
  roomType: string
  backupJson: string
  org: string
}

export type GetBackupChatReq = {
  roomId: string
}

export type SearchReq = {
  searchString: string
  skip: number
  take: number
}

export type AddUserReq = {
  user_Id: string
  user_Name: string
  user_Role: string
  user_Image: string
  user_Status: string
  user_Online: boolean
  user_LastSeen: string
}

export type GetChatRoomsByUserReq = {
  user_Id: string
  skip: number
  take: number
}

export type NotiSettingReq = {
  user_Id: string
  notification_banner: boolean
  notification_sound: boolean
}

export type ThemeSettingReq = {
  user_Id: string
  theme: string
}
