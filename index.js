import express from 'express'
import { promises as fs } from 'fs'

import accounterRouter from './accountRouter.js'

const { writeFile, readFile } = fs

const app = express()
app.use(express.json())

app.use('/account', accounterRouter)

app.listen(3000, async () => {
  try {
    await readFile('accounts.json')
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    }
    writeFile('accounts.json', JSON.stringify(initialJson))
      .then(() => {
        console.log('Server running and file created!')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  console.log('Running at port 3000!')
})
