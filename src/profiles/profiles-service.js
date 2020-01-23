const ProfilesService = {
  getAllProfiles(knex, userid){
    return knex.select('*').from('profiles').where('owner_id', userid)
  },

  insertProfile(knex, newProfile) {
    return knex('profiles').insert(newProfile)
  },

  getById(knex, id) {
    return knex
    .select('*')
    .from('profiles')
    .where('id', id)
    .first()
  },
  deleteProfile(knex,id) {
    return knex('profiles')
      .where({ id })
      .delete()
  },
  updateProfile(knex, id, newProfile) {
    return knex('profiles')
      .where({ id })
      .update(newProfile)
  }

}

module.exports = ProfilesService