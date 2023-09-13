import {Router} from 'express'
import {verifyHmac} from '../middleware/hmacAuth'
import * as AuthController from '../controllers/auth.controller'

const keyRouter: Router = Router()

// API related to chat flows
keyRouter.post('/publickey', AuthController.getpublicKey)
keyRouter.post('/gettoken', verifyHmac, AuthController.getToken)
// DEMO
keyRouter.post('/demofunc', AuthController.demoFunc)
export default keyRouter
