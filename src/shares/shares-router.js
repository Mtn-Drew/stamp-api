const express = require('express')
const path = require('path')
const xss = require('xss')
const SharesService = require('./shares-service')
const { requireAuth } = require('../middleware/jwt-auth.js')

const sharesRouter = express.Router()
//const jsonParser = express.json()

const sanatizeShare = (share) => ({
  id: share.id,
  // title: xss(share.template_title),
  // desc: share.template_desc,
  user: share.user_id,
  // write: share.write,
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

//get the shared template by id  
// sharesRouter
//   .use(requireAuth)
//   .route('/templates')
//     .get((req, res, next) => {
//     console.log('share/templates')
//     // SharesService.getAllTemplates(req.app.get('db'), req.user.id)
//     SharesService.getAllTemplates(req.app.get('db'), template_id)
//     .then(res.json())
//     console.log('sharesRouter/templates', res.json()).catch(next)
//   })



//get template that was on the shared table
sharesRouter
  .use(requireAuth)
  .route('/templates/:template_id')
  .all(requireAuth)
  .all(checkTemplateExists)
  .get((req, res, next) => {
    res.json(sanatizeTemplate(res.template))
  })
  // .delete((req, res, next) => {
  //   TemplatesService.deleteTemplate(req.app.get('db'), req.params.template_id)
  //     .then(() => {
  //       res.status(204).end()
  //     })
  //     .catch(next)
  // })

  // .patch(jsonParser, (req, res, next) => {
  //   const { title, owner } = req.body
  //   const templateToUpdate = { title, owner }

  //   const numberOfValues = Object.values(templateToUpdate).filter(Boolean)
  //     .length
  //   if (numberOfValues === 0) {
  //     return res.status(400).json({
  //       error: {
  //         message: `Request body must contain 'title'`
  //       }
  //     })
  //   }
  //   TemplatesService.updateTemplate(
  //     req.app.get('db'),
  //     req.params.template_id,
  //     templateToUpdate
  //   )
  //     .then((numRowsAffected) => {
  //       res.status(204).end()
  //     })
  //     .catch(next)
  // })

async function checkTemplateExists(req, res, next) {
  try {
    const template = await TemplatesService.getById(
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
    SharesService.getAllProfiles(req.app.get('db'), template_id)
      // .then((profile) => {
      //   res.json(profile.map(sanitizeProfile))
      // })
      .then(res.json())
      .catch(next)
  })

module.exports = sharesRouter
