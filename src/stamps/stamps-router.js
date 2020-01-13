const express = require('express')
const path = require('path')
const xss = require('xss')
const StampsService = require('./stamps-service')
const stampsRouter = express.Router()
const jsonParser = express.json()

const sanatizeStamp = (stamp) => ({
  id: stamp.id,
  content: xss(stamp.content),
  name: xss(stamp.name),
  modified: stamp.modified,
  folder_id: stamp.folder_id
})








module.exports = stampsRouter