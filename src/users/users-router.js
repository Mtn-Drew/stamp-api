const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth.js')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  // .use(requireAuth)
  .route('/')
  //filter by owner id ++++++++++++++++++++++++++++++++++++++++++
  // .get((req, res, next) => {
  //   console.log('templateRouther', req.user.id)
  //   UsersService.getAllUsers(req.app.get('db'), req.user.id)
  //     .then((user) => {
  //       res.json(user.map(serializeUser(user)))
  //     })
  //     .catch(next)
  // })
  .post(jsonBodyParser, (req, res, next) => {
    const { password, user_name, email } = req.body
    console.log('userRouter /')
    for (const field of ['email', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    // TODO: check user_name doesn't start with spaces

    const passwordError = UsersService.validatePassword(password)

    if (passwordError) return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(req.app.get('db'), user_name)
      .then((hasUserWithUserName) => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
      })
      .then((hashedPassword) => {
        const newUser = {
          user_name,
          password: hashedPassword,
          email,
          date_created: 'now()'
        }
        let user

        return UsersService.insertUser(req.app.get('db'), newUser)
      })
      .then((u) => {
        user = u
        const promises = UsersService.defaultPopulate(req.app.get('db'), user)
        return Promise.all(promises)
      })
      .then(() => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(UsersService.serializeUser(user))
      })

      .catch(next)
  })

module.exports = usersRouter
