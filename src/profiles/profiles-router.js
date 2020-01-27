const express = require('express')
const path = require('path')
const xss = require('xss')
const ProfilesService = require('./profiles-service')
const { requireAuth } = require('../middleware/jwt-auth.js')

const profilesRouter = express.Router()
const jsonParser = express.json()

const sanitizeProfile = (profile) => ({
  id: profile.id,
  title: xss(profile.title),
  template_id: profile.template_id,
  owner_id: profile.owner_id,
  archived: profile.archived,
  write: profile.write,
  disp_ord: profile.disp_ord
})

profilesRouter
  .use(requireAuth)
  .route('/')

  .get((req, res, next) => {
    ProfilesService.getAllProfiles(req.app.get('db'), req.user.id)
      .then((profile) => {
        res.json(profile.map(sanitizeProfile))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, template_id, owner_id } = req.body
    const newProfile = { title, template_id, owner_id }

    for (const [key, value] of Object.entries(newProfile)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    ProfilesService.insertProfile(req.app.get('db'), newProfile)
      .then((profile) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${profile.id}`))
          .json(sanitizeProfile(profile))
      })
      .catch(next)
  })

profilesRouter
  .route('/:profile_id')
  .all(requireAuth)
  .all(checkProfileExists)
  .get((req, res, next) => {
    res.json(sanitizeProfile(res.profile))
  })
  .delete((req, res, next) => {
    ProfilesService.deleteProfile(req.app.get('db'), req.params.profile_id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const { title, template_id } = req.body
    const profileToUpdate = { title, template_id }

    const numberOfValues = Object.values(profileToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'title'`
        }
      })
    }
    ProfilesService.updateProfile(
      req.app.get('db'),
      req.params.profile_id,
      profileToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end()
      })
      .catch(next)
  })

async function checkProfileExists(req, res, next) {
  try {
    const profile = await ProfilesService.getById(
      req.app.get('db'),
      req.params.profile_id
    )

    if (!profile)
      return res.status(404).json({
        error: `Profile doesn't exist`
      })

    res.profile = profile
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = profilesRouter
