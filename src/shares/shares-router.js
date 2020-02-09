const express = require('express')
const path = require('path')
const xss = require('xss')
const SharesService = require('./shares-service')
const { requireAuth } = require('../middleware/jwt-auth.js')

const sharesRouter = express.Router()
//const jsonParser = express.json()

const sanatizeShare = (share) => ({
  id: share.id,
  title: xss(share.template_title),
  desc: share.template_desc,
  user: share.user_id,
  write: share.write,
  template_id: share.template_id
})

sharesRouter
  .use(requireAuth)
  .route('/')
  //filter by owner id ++++++++++++++++++++++++++++++++++++++++++
  .get((req, res, next) => {
    console.log('sharesRouter', req.user.id)
    SharesService.getAllShares(req.app.get('db'), req.user.id)
      .then((share) => {
        res.json(share.map(sanatizeShare))
      })
      .catch(next)
  })

sharesRouter
  .use(requireAuth)
  .route('/templates')
  //filter by owner id ++++++++++++++++++++++++++++++++++++++++++
  .get((req, res, next) => {
    console.log('templateRouter', req.user.id)
    // SharesService.getAllTemplates(req.app.get('db'), req.user.id)
    SharesService.getAllTemplates(req.app.get('db'), template_id)
      // .then((template) => {
      // res.json(template.map(sanatizeTemplate))
      .then(res.json())
      .catch(next)
  })

sharesRouter
  .use(requireAuth)
  .route('/profiles')
  .get((req, res, next) => {
    SharesService.getAllProfiles(req.app.get('db'), template_id)
      // .then((profile) => {
      //   res.json(profile.map(sanitizeProfile))
      // })
      .then(res.json())
      .catch(next)
  })

sharesRouter
  .use(requireAuth)
  .route('/stamps')
  .get((req, res, next) => {
    SharesService.getAllProfiles(req.app.get('db'), template_id)
      // .then((profile) => {
      //   res.json(profile.map(sanitizeProfile))
      // })
      .then(res.json())
      .catch(next)
  })

module.exports = sharesRouter
