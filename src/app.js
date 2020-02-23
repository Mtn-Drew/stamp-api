const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const templatesRouter = require('./templates/templates-router')
const profilesRouter = require('./profiles/profiles-router')
const stampsRouter = require('./stamps/stamps-router')
const sharesRouter = require('./shares/shares-router')
const shareablesRouter = require('./shareables/shareables-router')


const app = express()

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
  })
)
// app.use(cors({
//   origin : process.env.CLIENT_ORIGIN
// }))
app.use(cors())

app.use(helmet())



app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/templates', templatesRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/stamps', stampsRouter)
app.use('/api/shares', sharesRouter)
app.use('/api/shareables', shareablesRouter)



app.get('/', (req, res) => {
  res.send('Hello, world!')
})
app.use(function errorHandler(error, req, res, next) {
  let response
  console.error(error)
  if (NODE_ENV === 'production') {
    response = { error: { message: 'Server error' } }
  } else {
   
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
