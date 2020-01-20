const TemplatesService = {
  getAllTemplates(knex, userid){
    return knex.select('*').from('templates').where('owner_id', userid)
  },

  insertTemplate(knex, newTemplate) {
    return knex('templates').insert(newTemplate)
  },

  getById(knex, id) {
    return knex
    .select('*')
    .from('templates')
    .where('id', id)
    .first()
  },

  deleteTemplate(knex,id) {
    return knex('templates')
      .where({ id })
      .delete()
  },
  
  updateTemplate(knex, id, newTemplate) {
    return knex('templates')
      .where({ id })
      .update(newTemplate)
  }

}

module.exports = TemplatesService