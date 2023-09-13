import mongoose from 'mongoose'

const MONGODB_URL =
  'mongodb+srv://puspendumatilal:i51jYlkHF5K5WL0l@cluster0.hzmt4kg.mongodb.net/iSyncChat?retryWrites=true&w=majority'

export const connectMongo = async () => {
  mongoose.Promise = Promise
  await mongoose.connect(MONGODB_URL).then(() => {
    console.log('Connected to Mongodb.')
  })
  mongoose.connection.on('error', (error: Error) => console.log(error))
}

export const closeMongo = async () => {
  mongoose.connection.close()
}
