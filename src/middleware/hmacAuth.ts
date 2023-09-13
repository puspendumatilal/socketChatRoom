import crypto from 'crypto'
import * as encLib from '../utils/encryption_helper'
import * as crypto_helper from '../utils/crypto_helper'
import {Request, Response, NextFunction} from 'express'
import {Socket} from 'socket.io'

export const generateHmac = (key: string, message: any): String => {
  const hmac = crypto.createHmac('sha256', key)
  hmac.update(message)
  const digest = hmac.digest('hex')
  return digest
}

export const verifyHmac = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const crypto_key_data = req.headers.x_e2e_crypto_key
  const encriptedClientIV = req.headers.x_e2e_crypto_iv
  const base64DecodedAES = crypto_helper.base64UrlSafeDecode(crypto_key_data)
  const clientIv = crypto_helper.base64UrlSafeDecode(encriptedClientIV)
  const clientAES_key = encLib.rsaDecryption(
    encLib.PrivateKey,
    base64DecodedAES,
  )

  const expectedDigest = generateHmac(clientAES_key, clientIv)
  const receivedDigest = req.body.digest

  if (
    crypto.timingSafeEqual(
      Buffer.from(expectedDigest),
      Buffer.from(receivedDigest),
    )
  ) {
    req.body.clientAES_key = clientAES_key
    req.body.clientIv = clientIv
    next()
  } else {
    console.log(
      'HMAC verification failed. The message may have been tampered with.',
    )
    return res.send({status: 'error', message: 'authentication fails'})
  }
}

export const verifySocketHmac = async (socket: Socket): Promise<boolean> => {
  try {
    const {x_e2e_crypto_key, x_e2e_crypto_iv, digest} = socket.handshake.headers
    // const encriptedClientIV = x_e2e_crypto_iv ... .... ... crypto_key_data
    const base64DecodedAES = crypto_helper.base64UrlSafeDecode(x_e2e_crypto_key)
    const clientIv = crypto_helper.base64UrlSafeDecode(x_e2e_crypto_iv)
    const clientAES_key = encLib.rsaDecryption(
      encLib.PrivateKey,
      base64DecodedAES,
    )

    const expectedDigest = generateHmac(clientAES_key, clientIv)
    const receivedDigest: any = digest
    return crypto.timingSafeEqual(
      Buffer.from(expectedDigest),
      Buffer.from(receivedDigest),
    )
  } catch (error) {
    return false
  }
}
