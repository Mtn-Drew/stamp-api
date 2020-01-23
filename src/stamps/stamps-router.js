const express = require('express')
const path = require('path')
const xss = require('xss')
const StampsService = require('./stamps-service')
const stampsRouter = express.Router()
const jsonParser = express.json()
const {requireAuth} = require('../middleware/jwt-auth.js')

const sanatizeStamp = (stamp) => ({
  id: stamp.id,
  content: xss(stamp.content),
  title: xss(stamp.title),
  template_id: stamp.template_id,
  profile_id: stamp.profile_id,
  owner_id: stamp.owner_id,
  archive: stamp.archive,
  write: stamp.write
})



stampsRouter 
 .use(requireAuth)
  .route('/')
  .get((req, res, next) => {
    StampsService.getAllStamps(req.app.get('db'), req.user.id)
    .then((stamp)=> {
      res.json(stamp.map(sanatizeStamp))
    })
    .catch(next)
  }) 
  .post(jsonParser, (req, res, next) => {
    const { title, template_id, owner_id, profile_id, content } = req.body
    const newStamp = { title, template_id, owner_id, profile_id, content }
  
  
    for (const [key, value] of Object.entries(newStamp)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    StampsService.insertStamp(req.app.get('db'), newStamp)
    .then((stamp) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${stamp.id}`))
        .json(sanatizeStamp(stamp))
    })
    .catch(next)
})



module.exports = stampsRouter