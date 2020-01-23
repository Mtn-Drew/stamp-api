const StampsService = {
  getAllStamps(knex, userid){
    return knex.select('*').from('stamps').where('owner_id', userid)
  },

  insertStamp(knex, newStamp) {
    return knex('stamps').insert(newStamp)
  },

  getById(knex, id) {
    return knex
    .select('*')
    .from('stamps')
    .where('id', id)
    .first()
  },
  deleteStamp(knex,id) {
    return knex('stamps')
      .where({ id })
      .delete()
  },
  updateStamp(knex, id, newStamp) {
    return knex('stamps')
      .where({ id })
      .update(newStamp)
  }

}

module.exports = StampsService