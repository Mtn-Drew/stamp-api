const express = require('express')
const path = require('path')
const xss = require('xss')
const TemplatesService = require('./templates-service')
const { requireAuth } = require('../middleware/jwt-auth.js')

const templatesRouter = express.Router()
const jsonParser = express.json()

const sanatizeTemplate = (template) => ({
  id: template.id,
  title: xss(template.title),
  owner: template.owner_id
})

templatesRouter
  // .use(requireAuth)
  .route('/')

  .get((req, res, next) => {
    TemplatesService.getAllTemplates(req.app.get('db'))
      .then((template) => {
        res.json(template.map(sanatizeTemplate))
      })
      .catch(next)
  })
  .post(jsonParser,(req, res, next) => {
    console.log(req.body)
    const { id, title, owner_id } = req.body
    const newTemplate = { id, title, owner_id }
    console.log(newTemplate)

    for (const [key, value] of Object.entries(newTemplate)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    

    TemplatesService.insertTemplate(req.app.get('db'), newTemplate)
      .then((template) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${template.id}`))
          .json(sanatizeTemplate(template))
      }
      )
      .catch(next)
      
  })

templatesRouter
  // .use(requireAuth)
  .route('/:template_id')
  // .all(requireAuth)
  .all(checkTemplateExists)
  .get((req, res, next) => {
    res.json(sanatizeTemplate(res.template))
  })
  .delete((req, res, next) => {
    TemplatesService.deleteTemplate(req.app.get('db'), req.params.template_id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const { title, owner } = req.body
    const templateToUpdate = { title, owner }

    const numberOfValues = Object.values(templateToUpdate).filter(Boolean)
      .length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'title'`
        }
      })
    }
    TemplatesService.updateTemplate(
      req.app.get('db'),
      req.params.template_id,
      templateToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end()
      })
      .catch(next)
  })

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

module.exports = templatesRouter
