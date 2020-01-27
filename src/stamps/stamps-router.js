const express = require('express')
const path = require('path')
const xss = require('xss')
const StampsService = require('./stamps-service')
const stampsRouter = express.Router()
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth.js')

const sanatizeStamp = (stamp) => ({
  id: stamp.id,
  content: xss(stamp.content),
  title: xss(stamp.title),
  template_id: stamp.template_id,
  profile_id: stamp.profile_id,
  owner_id: stamp.owner_id,
  archived: stamp.archive,
  write: stamp.write,
  disp_ord: stamp.disp_ord
})

stampsRouter
  .use(requireAuth)
  .route('/')
  .get((req, res, next) => {
    StampsService.getAllStamps(req.app.get('db'), req.user.id)
      .then((stamp) => {
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

stampsRouter
  .use(requireAuth)
  .route('/:stamp_id')
  // .all(requireAuth)
  .all(checkStampExists)
  .get((req, res, next) => {
    res.json(sanatizeStamp(res.stamp))
  })
  .delete((req, res, next) => {
    StampsService.deleteStamp(req.app.get('db'), req.params.stamp_id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const { title, profile_id, content } = req.body
    const stampToUpdate = { title, profile_id, content }
    const numberOfValues = Object.values(stampToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'title'`
        }
      })
    }
    StampsService.updateStamp(
      req.app.get('db'),
      req.params.stamp_id,
      stampToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end()
      })
      .catch(next)
  })

async function checkStampExists(req, res, next) {
  try {
    const stamp = await StampsService.getById(
      req.app.get('db'),
      req.params.stamp_id
    )

    if (!stamp)
      return res.status(404).json({
        error: `Stamp doesn't exist`
      })

    res.stamp = stamp
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = stampsRouter
