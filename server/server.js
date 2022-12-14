require('dotenv').config({ path: './config.env' })
require('./db')

const app = require('./app')

process.on('uncaughtException', (err) => {
  console.log(`${'uncaught Exception!'.toUpperCase()} 💥 Shutting down...`)
  process.exit(1)
})

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`)
})

process.on('unhandledRejection', (err) => {
  console.log(`${'unhandled Rejection!'.toUpperCase()} 💥 Shutting down...`)
  server.close(() => process.exit(1))
})
