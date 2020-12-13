import express from 'express'
import { promises as fs } from 'fs'
import winston from 'winston'

import accounterRouter from './accountRouter.js'

const { writeFile, readFile } = fs

const { combine, timestamp, label, printf } = winston.format
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'my-bank-api.log' }),
  ],
  format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
})

const app = express()
app.use(express.json())

app.use('/account', accounterRouter)

app.listen(3000, async () => {
  try {
    await readFile('accounts.json')
    logger.info('API running!')
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    }
    writeFile('accounts.json', JSON.stringify(initialJson))
      .then(() => {
        logger.info('API running and file created!')
      })
      .catch((err) => {
        logger.error(err)
      })
  }
  console.log('Running at port 3000!')
})
