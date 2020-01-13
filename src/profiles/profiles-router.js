const express = require('express')
const path = require('path')
const xss = require('xss')
const ProfilesService = require('./profiles-service')
const profilesRouter = express.Router()
const jsonParser = express.json()

const sanatizeProfile = (profile) => ({
  id: profile.id,
  content: xss(profile.content),
  name: xss(profile.name),
  modified: profile.modified,
  folder_id: profile.folder_id
})








module.exports = profilesRouter