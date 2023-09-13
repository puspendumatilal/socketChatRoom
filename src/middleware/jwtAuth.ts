import jwt from 'jsonwebtoken'
import * as cryptoHelper from '../utils/crypto_helper'
import pgPool from '../database/pg'
import {Request, Response, NextFunction} from 'express'

interface JsonObject {
  // Define the structure of your JSON object
  [key: string]: any
}

export const generateJWT = (jsonObject: JsonObject): string => {
  const privateKey = cryptoHelper.privateKey
  const token = jwt.sign(jsonObject, privateKey, {
    algorithm: 'RS256',
    expiresIn: '15m',
  })
  return token
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const publicKey = cryptoHelper.publicKey
  let token = req.headers.token
  if (typeof token === 'string' && token.includes('Bearer ')) {
    token = token.replace('Bearer ', '')
  } else {
    return res.send({status: 'error', message: 'Token format fails'})
  }

  try {
    const decodedJson = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      maxAge: '15m',
    }) as JsonObject
    const {rows} = await pgPool.query(
      'SELECT * FROM users where id = $1 AND status = $2',
      [decodedJson.id, 'active'],
    )
    if (rows.length === 0) {
      return res.send({status: 'error', message: 'user not found'})
    }
    next()
  } catch (error) {
    return res.send({
      status: 'error',
      message: 'Token verification fails',
      data: error,
    })
  }
}
