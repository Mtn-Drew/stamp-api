const ShareablesService = {
  getShareables(knex) {
    return knex.select('*').from('shareable_templates')
    //.where('user_id', userid)
  },

  getById(knex, id) {
    return knex
      .select('*')
      .from('shareable_templates') // will need a variable here
      .where('template_id', id)
      .first()
  },

  insertTemplate(knex, newTemplate) {
    return knex('shared_templates').insert(newTemplate)
  }
}
module.exports = ShareablesService
