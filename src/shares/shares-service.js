const SharesService = {
  getAllShares(knex, userid) {
    return knex
      .select('*')
      .from('shared_templates')
      .where('user_id', userid)
  },
  getAllTemplates(knex, template_id) {
    return knex
      .select('*')
      .from('templates')
      .where('id', template_id)
      .first()
  },
  //use templateId instead of ownerId
  getAllProfiles(knex, template_id) {
    return knex
      .select('*')
      .from('profiles')
      .where('template_id', template_id)
  },
  //use templateId instead of ownerId
  getAllStamps(knex, template_id) {
    return knex
      .select('*')
      .from('stamps')
      .where('template_id', template_id)
  },

  // insertTemplate(knex, newTemplate) {
  //   return knex('templates').insert(newTemplate)
  // },

  //not sure if I use this one
  getById(knex, id) {
    return knex
      .select('*')
      .from('templates')// will need a variable here
      .where('id', id)
      .first()
  },
  //need to determine share id
  deleteShare(knex, id) {
    return knex('shares')
      .where({ id })
      .delete()
  }

  // updateTemplate(knex, id, newTemplate) {
  //   return knex('templates')
  //     .where({ id })
  //     .update(newTemplate)
  // }
}

module.exports = SharesService
