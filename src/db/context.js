import dotenv from 'dotenv'
import mongoose from 'mongoose'
import UserModel from './models/userModel.js'

dotenv.config()

const MONGO_URI = `${process.env.MONGO_SERVER}/${process.env.MONGO_DB_NAME}`
let connectionState = false

const initializeDb = async () => {
  try {
    if (!mongoose.modelNames().includes('User')) {
      await UserModel.init()
      await UserModel.createIndexes()
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const connectToDb = async () => {
  if (connectionState === true) {
    throw new Error('Ya existe una conexión a la base de datos')
  }
  try {
    await initializeDb()
    await mongoose.connect(MONGO_URI)
    connectionState = true
  } catch (error) {
    throw new Error(error.message)
  }
}

const disconnectFromDb = async () => {
  if (!connectionState) {
    throw new Error('No hay una conexión a la base de datos')
  }
  try {
    await mongoose.connection.close()
    connectionState = false
  } catch (error) {
    throw new Error(error.message)
  }
}

export { connectToDb, disconnectFromDb }
