import express from 'express'
const router = express.Router()

// const AuthController = require("../controllers/auth.controller");
// const hmacAuth = require("../middleware/hmacAuth");
// const jwtAuth = require("../middleware/jwtAuth")

//API related to chat flows
// router.route("/gettoken").post(trimRequest.all, hmacAuth.verifyHmac, AuthController.getToken);
// router.route("/initchat").post(trimRequest.all, jwtAuth.verifyJWT, AuthController.initChat);
// router.route("/backupchat").post(trimRequest.all, jwtAuth.verifyJWT, AuthController.backupChat);
// router.route("/getbackupchat").post(trimRequest.all, jwtAuth.verifyJWT, AuthController.getBackupChat);
// /changeuserstatus api using mongo realtime
// /fetchonlineusers

// router.route("/demofunc").post(trimRequest.all, AuthController.demoFunc);

export default router
