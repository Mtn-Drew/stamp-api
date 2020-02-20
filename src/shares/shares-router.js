const express = require('express')
const path = require('path')
const xss = require('xss')
const SharesService = require('./shares-service')
const { requireAuth } = require('../middleware/jwt-auth.js')

const sharesRouter = express.Router()
//const jsonParser = express.json()

const sanitizeShare = (share) => ({
  id: share.id,
  user: share.user_id,
  template_id: share.template_id
})

const sanitizeTemplate = (template) => ({
  id: template.id,
  title: xss(template.title),
  owner: template.owner_id,
  archived: template.archived,
  write: template.write,
  disp_ord: template.disp_ord
})

const sanitizeProfile = (profile) => ({
  id: profile.id,
  title: xss(profile.title),
  template_id: profile.template_id,
  owner_id: profile.owner_id,
  archived: profile.archived,
  write: profile.write,
  disp_ord: profile.disp_ord
})

const sanitizeStamp = (stamp) =>({
  id: stamp.id,
  title: stamp.title,
  content: stamp.content,
  template_id: stamp.template_id,
  profile_id: stamp.profile_id,
  owner_id: stamp.owner_id,
  archived: stamp.archived,
  write: stamp.write,
  disp_ord: stamp.disp_ord
})

//check the shares table for user
sharesRouter
  .use(requireAuth)
  .route('/')
  .get((req, res, next) => {
    console.log('sharesRouter/', req.user.id)
    SharesService.getAllShares(req.app.get('db'), req.user.id)
      .then((share) => {
        res.json(share.map(sanitizeShare))
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
    console.log('template req.params->', req.params)

    res.json(sanitizeTemplate(res.template))
    console.log('res.template ', res.template)
   
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

// async function checkProfileExists(req, res, next) {
//   try {
//     const profile = await SharesService.getProfileByTemplateId(
//       req.app.get('db'),
//       req.params.template_id
//     )
// console.log('req.params.template_id ->', req.params.template_id)
//     if (!profile)
//       return res.status(404).json({
//         error: `Profile doesn't exist`
//       })

//     res.profile = profile
//     console.log('checkProfileExists ->', profile)
//     next()
//   } catch (error) {
//     next(error)
//   }
// }

sharesRouter
  .route('/profiles/:template_id')
  .all(requireAuth)
  .get((req, res, next) => {
    // console.log('get-profiles/tmp_id ', req.params.template_id)
    // console.log('req.user.id ', req.user.id)
    SharesService.getAllProfiles(req.app.get('db'), req.params.template_id)
   
    .then((profile)=>{
      // console.log('profile--', profile)
      // console.log('res.profile', res.profile)
      res.json(profile.map(sanitizeProfile))
    })
    .catch(next)

  })

sharesRouter
  
  .route('/stamps/:template_id')
  .all(requireAuth)
  .get((req, res, next) => {
    SharesService.getAllStamps(req.app.get('db'), req.params.template_id)

      .then((stamp)=>{
        res.json(stamp.map(sanitizeStamp))
      })
      .catch(next)
  })

module.exports = sharesRouter
