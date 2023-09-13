// Import necessary dependencies and the function to be tested
import {Request, Response} from 'express'
import {
  verifyPrivateRoomMember,
  changeUserParticipationStatus,
  updateUserOnlineOffline,
} from '../../src/utils/socket_helper'
import * as helper from '../../src/utils/helper'
import chatBackupModel from '../../src/schema/chat_backup'
import chatUserInfo from '../../src/schema/chat_user_info'
import chatRoomModel from '../../src/schema/chat_room_info'
import chatLog from '../../src/schema/chat-event-logs'
import chatRoomInfoSchemaModel from '../../src/schema/chat_user_info'
import {UserStatus} from '../../src/common/enums'
import chatRoomParticipantInfoModel from '../../src/schema/chat_room_participant_info'
import {ParticipantStatus} from '../../src/common/enums'

import {connectMongo, closeMongo} from '../db/mongo.testconfig'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await closeMongo()
})

describe('verifyPrivateRoomMember', () => {
  it('should return a false when room id is not exist', async () => {
    // Arrange
    const data = {
      room: {
        id: '64e2eb026ea996ad769a6dd3',
      },
      user_Id: '2343',
    }

    const value = await verifyPrivateRoomMember(data)

    expect(value).toBe(false)
  })

  it('should return a false when user_Id is not exist', async () => {
    // Arrange
    const data = {
      room: {
        id: '64e2e689f9f1a9c9ae5dfe28',
      },
      user_Id: '0000',
    }

    const value = await verifyPrivateRoomMember(data)

    expect(value).toBe(false)
  })

  it('should return a true when user is valid', async () => {
    // Arrange
    const data = {
      room: {
        id: '64e2e689f9f1a9c9ae5dfe28',
      },
      user_Id: '2343',
    }

    const value = await verifyPrivateRoomMember(data)

    expect(value).toBe(true)
  })
})

describe('changeUserParticipationStatus', () => {
  it('should return a false when room id is not exist', async () => {
    // Arrange
    const data = {
      room: {
        id: '64e2eb026ea996ad769a6dd3',
      },
      user_Id: '2343',
    }
    const value = await changeUserParticipationStatus(data)
    expect(value).toBe(false)
  })
  it('should return a false when user_Id is not exist', async () => {
    // Arrange
    const data = {
      room: {
        id: '64e2e689f9f1a9c9ae5dfe28',
      },
      user_Id: '0000',
    }
    const value = await changeUserParticipationStatus(data)
    expect(value).toBe(false)
  })
  it('should return a true when user is valid', async () => {
    // Arrange
    const data = {
      room: {
        id: '64e2f051792bfda15622b61d',
      },
      user_Id: '2343',
      event: 'Accepted',
      participantstatus: 'Accepted',
    }
    const value = await changeUserParticipationStatus(data)
    expect(value).toBe(true)
  })
})

describe('updateUserOnlineOffline', () => {
  it('should return a false when user_Id is not exist', async () => {
    // Arrange
    const data = {
      room: {
        id: '64e2f051792bfda15622b61d',
      },
      user_Id: '0000',
      user_Online: true,
    }
    const value = await updateUserOnlineOffline(data)
    expect(value).toBe(false)
  })
  it('should return a true when user is valid', async () => {
    // Arrange
    const data = {
      room: {
        id: '64e2f051792bfda15622b61d',
      },
      user_Id: '2343',
      user_Online: true,
    }
    const value = await updateUserOnlineOffline(data)
    expect(value).toBe(true)
  })
})
