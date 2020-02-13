const express = require('express')
const path = require('path')
const xss = require('xss')
const SharesService = require('./shares-service')
const { requireAuth } = require('../middleware/jwt-auth.js')

const sharesRouter = express.Router()
//const jsonParser = express.json()

const sanatizeShare = (share) => ({
  id: share.id,
  user: share.user_id,
  template_id: share.template_id
})

const sanatizeTemplate = (template) => ({
  id: template.id,
  title: xss(template.title),
  owner: template.owner_id,
  archived: template.archived,
  write: template.write,
  disp_ord: template.disp_ord
})

//check the shares table for user
sharesRouter
  .use(requireAuth)
  .route('/')
  .get((req, res, next) => {
    console.log('sharesRouter/', req.user.id)
    SharesService.getAllShares(req.app.get('db'), req.user.id)
      .then((share) => {
        res.json(share.map(sanatizeShare))
      })
      .catch(next)
  })


//get template that was on the shared table
sharesRouter
  .route('/templates/:template_id')
  .all(requireAuth)
  .all(checkTemplateExists)
  
  .get((req, res) => {
     SharesService.getAllTemplates(req.app.get('db'), req.params)
    console.log('req.params->',req.params)
    
    res.json(sanatizeTemplate(res.template))
    console.log('res.template ', res.template);
 
  })


async function checkTemplateExists(req, res, next) {
  try {
    const template = await SharesService.getById(
      req.app.get('db'),
      req.params.template_id
    )

    if (!template)
      return res.status(404).json({
        error: `Template doesn't exist`
      })

    res.template = template
    next()
  } catch (error) {
    next(error)
  }
}

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
    SharesService.getAllStamps(req.app.get('db'), template_id)
      // .then((profile) => {
      //   res.json(profile.map(sanitizeProfile))
      // })
      .then(res.json())
      .catch(next)
  })

module.exports = sharesRouter
