const express = require('express')
const path = require('path')
const xss = require('xss')
const ProfilesService = require('./profiles-service')
const profilesRouter = express.Router()
const jsonParser = express.json()

const sanatizeProfile = (profile) => ({
  id: profile.id,
  title: xss(profile.title),
  template_id: profile.template_id
})

profilesRouter 
  .route('/')
  .get((req, res, next) => {
    ProfilesService.getAllProfiles(req.app.get('db'))
    .then((profile)=> {
      res.json(profile.map(sanatizeProfile))
    })
    .catch(next)
  }) 






module.exports = profilesRouter