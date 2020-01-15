const express = require('express')
const path = require('path')
const xss = require('xss')
const TemplatesService = require('./templates-service')
const templatesRouter = express.Router()
const jsonParser = express.json()

const sanatizeTemplate = (template) => ({
  id: template.id,
  title : xss(template.title),
  owner: template.owner_id,    
})


templatesRouter 
  .route('/')
  .get((req, res, next) => {
    TemplatesService.getAllTemplates(req.app.get('db'))
    .then((template)=> {
      res.json(template.map(sanatizeTemplate))
    })
    .catch(next)
  }) 

  // .post

  templatesRouter 
    .route('/:template_id')
    .all((req, res, next) => {
      TemplatesService.getById(req.app.get('db'), req.params.template_id)
        .then((template) => {
          if (!template) {
            return res.status(404).json({
              error: {message: 'Template does not exist'}
            })
          }
          res.template = template
          next()
        })
      .get((req, res, next)=>{
        res.json(sanatizeNote(res.template))
      })
      .delete((req, res, next)=> {
        TemplatesService.deleteTemplate(req.app.get('db'), req.params.template_id)
          .then(()=>{
            res.status(204).end()
          })
          .catch(next)
      })
      .patch(jsonParser, (req, res, next) => {
        const { title } = req.body  
        const templateToUpdate = { title }
    
        const numberOfValues = Object.values(templateToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
          return res.status(400).json({
            error: {
              message: `Request body must contain 'title'`
            }
          })
        }
        TemplateService.updateNote(req.app.get('db'), req.params._id, templateToUpdate)
          .then((numRowsAffected) => {
            res.status(204).end()
          })
          .catch(next)
    })
  })

module.exports = templatesRouter