import express from 'express'
import { connectToDb, disconnectFromDb } from './db/context.js'
import UserModel from './db/models/userModel.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const app = express()

app.use(express.json())

app.get('/',
  (request, response) => {
    response.json({ mensaje: 'API de Usuarios' })
  }
)

app.post('/',
  async (request, response) => {
    try {
      const body = request.body
      const { name, lastname, email, password } = body
      const hashedPassword = await bcrypt.hash(password, 12)
      await connectToDb()
      const newUser = new UserModel({ name, lastname, email, password: hashedPassword })
      await newUser.save()
      response.json({ newUser })
    } catch (error) {
      // Enviar solo una respuesta
      let message

      if (error.message.includes('ECONNREFUSED')) {
        message = 'No se pudo conectar a la base de datos'
      } else if (error.code === 11000) {
        message = 'Ya existe una cuenta con ese correo electrónico'
      } else {
        message = error.message
      }

      // Enviar la respuesta solo una vez
      response.status(400).json({ message })
    } finally {
      if (mongoose.connection.readyState === 1) {
        await disconnectFromDb()
      }
    }
  }
)

app.listen(3000,
  () => {
    console.log('Servidor corriendo en: http://localhost:3000')
  }
)
