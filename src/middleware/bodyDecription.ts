import * as cryptoHelper from '../utils/crypto_helper'
import * as encLib from '../utils/encryption_helper'
import {Request, Response, NextFunction} from 'express'

export const setReqBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const crypto_key_data = req.headers.x_e2e_crypto_key
    // AES key should be URL SAFE encoded
    const base64DecodedAES = cryptoHelper.base64UrlSafeDecode(crypto_key_data)
    const clientAES_key = encLib.rsaDecryption(
      encLib.PrivateKey,
      base64DecodedAES,
    )
    // BODY DATA should be URL SAFE encoded
    const dataStr = encLib.getDecryptionValue(
      clientAES_key,
      cryptoHelper.base64UrlSafeDecode(req.body.data),
    )
    req.body = JSON.parse(dataStr)
    next()
  } catch (error) {
    return res.send({
      status: 'error',
      message: 'Decription fails',
      data: error,
    })
  }
}
