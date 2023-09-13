import {Router} from 'express'
import {verifyJWT} from '../middleware/jwtAuth'
import {setReqBody} from '../middleware/bodyDecription'
import * as ChatController from '../controllers/chatcontroller'
import * as UserController from '../controllers/usercontroller'
import * as SearchController from '../controllers/searchcontroller'
import * as UserSettingsController from '../controllers/usersettingscontroller'

const router: Router = Router()
router.use(verifyJWT)
router.use(setReqBody)

router.post('/initchat', ChatController.initChat)
router.post('/backupchat', ChatController.backupChat)
router.post('/getbackupchat', ChatController.getBackupChat)

// User Controller API
router.post('/addnewuser', UserController.addNewUserToChatlist)
router.post('/getonlineusers', UserController.getOnlineUsers)
router.post('/getchatroomsbyuser', UserController.getChatRoomsByUser)

router.post('/search/userlist', SearchController.searchUserList)
router.post('/search/chatroom', SearchController.searchChatRoom)

// Settings api
router.post(
  '/settings/updatenotification',
  UserSettingsController.updateNotificationSettings,
)
router.post(
  '/settings/updatetheme',
  UserSettingsController.updateThemePreference,
)

export default router
