const express = require('express')
const path = require('path')
const xss = require('xss')
const ShareablesService = require('./shareables-service')
const { requireAuth } = require('../middleware/jwt-auth.js')
const jsonParser = express.json()

const shareablesRouter = express.Router()


const sanitizeShareable = (shareable) => ({
  template_title: shareable.template_title,
  template_desc: shareable.template_desc,
  id: shareable.id,
  template_id: shareable.template_id
})

const sanitizeShared = (shared)=>({
  template_id: shared.template_id,
  user_id: shared.user_id
})

// const sanitizeTemplate = (template) => ({
//   id: template.id,
//   title: xss(template.title),
//   owner: template.owner_id,
//   archived: template.archived,
//   write: template.write,
//   disp_ord: template.disp_ord
// })

// const sanitizeProfile = (profile) => ({
//   id: profile.id,
//   title: xss(profile.title),
//   template_id: profile.template_id,
//   owner_id: profile.owner_id,
//   archived: profile.archived,
//   write: profile.write,
//   disp_ord: profile.disp_ord
// })

// const sanitizeStamp = (stamp) =>({
//   id: stamp.id,
//   title: stamp.title,
//   content: stamp.content,
//   template_id: stamp.template_id,
//   profile_id: stamp.profile_id,
//   owner_id: stamp.owner_id,
//   archived: stamp.archived,
//   write: stamp.write,
//   disp_ord: stamp.disp_ord
// })

//check the shares table for user
shareablesRouter 
  .use(requireAuth)
  .route('/')
  .get((req, res, next) => {
    console.log('shareablesRouter/')
    ShareablesService.getShareables(req.app.get('db'))
      .then((share) => {
        res.json(share.map(sanitizeShareable))
        console.log('share.map ', share.map(sanitizeShareable))
      })
      .catch(next)
  })

//get template that was on the shared table
shareablesRouter
  .route('/templates/:template_id')
  .all(requireAuth)
  .all(checkTemplateExists)

  .get((req, res) => {
    ShareablesService.getAllTemplates(req.app.get('db'), req.params)
    console.log('template req.params->', req.params)

    res.json(sanitizeTemplate(res.template))
    console.log('res.template ', res.template)
   
  })

  // .delete((req, res, next) => {
  //   ShareablesService.deleteShare(req.app.get('db'), req.params.template_id)
  //     .then(() => {
  //       res.status(204).end()
  //     })
  //     .catch(next)
  // })

async function checkTemplateExists(req, res, next) {
  try {
    const template = await ShareablesService.getById(
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

// sharesRouter
//   .route('/profiles/:template_id')
//   .all(requireAuth)
//   .get((req, res, next) => {
//     // console.log('get-profiles/tmp_id ', req.params.template_id)
//     // console.log('req.user.id ', req.user.id)
//     SharesService.getAllProfiles(req.app.get('db'), req.params.template_id)
   
//     .then((profile)=>{
//       // console.log('profile--', profile)
//       // console.log('res.profile', res.profile)
//       res.json(profile.map(sanitizeProfile))
//     })

//     .catch(next)

//   })

// sharesRouter
  
//   .route('/stamps/:template_id')
//   .all(requireAuth)
//   .get((req, res, next) => {
//     SharesService.getAllStamps(req.app.get('db'), req.params.template_id)

//       .then((stamp)=>{
//         res.json(stamp.map(sanitizeStamp))
//       })
//       .catch(next)
//   })

shareablesRouter
.use(requireAuth)
.route('/:template_id')
.all(requireAuth)
.all(checkTemplateExists)
.post(jsonParser, (req, res, next) => {
  console.log('post', req.body)
  
  const { template_id, user_id } = req.body
  const newTemplate = { template_id, user_id: req.user.id }
  console.log('newTemplate', newTemplate)

  for (const [key, value] of Object.entries(newTemplate)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      })
    }
  }

  ShareablesService.insertTemplate(req.app.get('db'), newTemplate)
    .then((template) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${template.id}`))
        .json(sanitizeShared(template))
    })
    .catch(next)
})

module.exports = shareablesRouter
