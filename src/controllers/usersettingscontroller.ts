import {Request, Response} from 'express'
import * as helper from '../utils/helper'
import chatUserSettingsSchemaModel from '../schema/chat_user_settings'
import * as customType from '../common/customreqtypes'

export const updateNotificationSettings = async function (
  req: Request,
  res: Response,
) {
  try {
    const rawbody: customType.NotiSettingReq =
      helper.parseJSON<customType.NotiSettingReq>(`${req.body}`)
    let userData: any = await chatUserSettingsSchemaModel.find({
      user_id: rawbody.user_Id,
    })
    if (!helper.isEmpty(userData)) {
      userData = userData[0]
      if (rawbody.hasOwnProperty('notification_banner'))
        userData.notification_banner = rawbody.notification_banner
      if (rawbody.hasOwnProperty('notification_sound'))
        userData.notification_sound = rawbody.notification_sound
      await userData.save()
      return res.send({
        status: 'success',
        message: 'settings updated',
        data: userData,
      })
    }
    return res.send({
      status: 'error',
      message: 'user not found',
    })
  } catch (error) {
    return res.send({status: 'error', message: 'Error'})
  }
}

export const updateThemePreference = async function (
  req: Request,
  res: Response,
) {
  try {
    const rawbody: customType.ThemeSettingReq =
      helper.parseJSON<customType.ThemeSettingReq>(`${req.body}`)
    console.log(rawbody)
    let userData: any = await chatUserSettingsSchemaModel.find({
      user_id: rawbody.user_Id,
    })
    if (!helper.isEmpty(userData)) {
      userData = userData[0]
      if (rawbody.theme) userData.theme_preference = rawbody.theme
      await userData.save()
      return res.send({
        status: 'success',
        message: 'settings updated',
        data: userData,
      })
    }
    return res.send({
      status: 'error',
      message: 'user not found',
    })
  } catch (error) {
    return res.send({status: 'error', message: 'Error'})
  }
}
