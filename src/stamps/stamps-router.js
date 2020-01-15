const express = require('express')
const path = require('path')
const xss = require('xss')
const StampsService = require('./stamps-service')
const stampsRouter = express.Router()
const jsonParser = express.json()

const sanatizeStamp = (stamp) => ({
  id: stamp.id,
  content: xss(stamp.content),
  title: xss(stamp.title),
  template_id: stamp.template_id,
  profile_id: stamp.profile_id
})



stampsRouter 
  .route('/')
  .get((req, res, next) => {
    StampsService.getAllStamps(req.app.get('db'))
    .then((stamp)=> {
      res.json(stamp.map(sanatizeStamp))
    })
    .catch(next)
  }) 




module.exports = stampsRouter