import {Request, Response} from 'express'
import * as encLib from '../utils/encryption_helper'
import * as cryptoHelper from '../utils/crypto_helper'
import * as hmacAuth from '../middleware/hmacAuth'
import pgPool from '../database/pg'
import * as jwt from '../middleware/jwtAuth'

export const getpublicKey = function (req: Request, res: Response) {
  const public_key = encLib.PublicKey
  const base64String = cryptoHelper.base64UrlSafeEncode(public_key)
  return res.send({server_pk: base64String})
}

export const demoFunc = async (req: Request, res: Response) => {
  const reqData = req.body.data
  const digest = req.body.digest
  let data: any = ''
  switch (req.body.case) {
    case 1:
      data = cryptoHelper.base64UrlSafeEncode(reqData)
      break
    case 2:
      data = cryptoHelper.base64UrlSafeDecode(reqData)
      break
    case 3:
      data = encLib.genrateAESKeyAndIv()
      break
    case 5:
      data = encLib.getEncryptionValue(req.body.aeskey, reqData)
      break
    case 6:
      data = encLib.getDecryptionValue(req.body.aeskey, reqData)
      break
    case 7:
      data = encLib.rsaEncryption(reqData, encLib.PublicKey)
      break
    case 8:
      data = encLib.rsaDecryption(encLib.PrivateKey, reqData)
      break
    case 9:
      data = JSON.parse(reqData)
      break
    case 10:
      data = JSON.stringify(reqData)
      break
    case 11:
      data = hmacAuth.generateHmac(req.body.aeskey, reqData)
      break
    case 12:
      // data = hmacAuth.verifyHmac(req, res);
      break
    case 13:
      //  this is for postman pretest script
      data = cryptoHelper.base64UrlSafeEncode(
        encLib.getEncryptionValue(req.body.aeskey, reqData),
      )
      break
  }

  res.send({status: 'success', data: data})
}

export const getToken = async (req: Request, res: Response) => {
  try {
    const id = req.body.user_Id
    const {rows} = await pgPool.query(
      'SELECT * FROM users where id = $1 AND status = $2',
      [id, 'active'],
    )
    if (rows.length == 0) {
      return res.send({status: 'error', message: 'user not found'})
    }
    const token = jwt.generateJWT(rows[0])
    res.send({status: 'success', data: token})
  } catch (error) {
    return res.send({status: 'error', data: error})
  }
}
