const StampsService = {
  getAllStamps(knex){
    return knex.select('*').from('stamps')
  },

  insertStamp(knex, newStamp) {
    return knex.insert(newStamp)
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