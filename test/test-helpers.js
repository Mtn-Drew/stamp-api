const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeFixtures() {
  const testUsers = makeUsersArray()
  const testTemplates = makeTemplatesArray(testUsers)
  const testProfiles = makeProfilesArray(testUsers, testTemplates)
  const testStamps = makeStampsArray(testUsers, testTemplates, testProfiles)
  return { testUsers, testTemplates, testProfiles, testStamps }
}

function makeUsersArray() {
  return [
    {
      id: '46100981-c7c3-41f7-9d6b-122ca9b71108',
      user_name: 'test-user-1',
      email: 'email@email.com',
      password: '11AAaa!!',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    }
  ]
}

function makeTemplatesArray(users) {
  return [
    {
      id: 'c5d5b2f3-4b3f-47a0-8563-4606e2c8b559',
      title: 'First title',
      owner_id: users[0].id,
      // archived: '',
      // write: '',
      disp_ord: 1
    }
  ]
}

function makeProfilesArray(users, templates) {
  return [
    {
      id: 'ae0dd3ef-ceae-4ed8-8023-6545aa9116c0',
      title: 'Profile 1',
      template_id: templates[0].id,
      owner_id: users[0].id,
      // archived: '',
      // write: '',
      disp_ord: 1
    }
  ]
}

function makeStampsArray(users, templates, profiles) {
  return [
    {
      id: '0f8c44ab-369d-4f1d-b8f9-5e38a6b50e42',
      title: 'Stamp 1',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, quas?',
      template_id: templates[0].id,
      profile_id: profiles[0].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: 1
    }
  ]
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx.raw(
      `TRUNCATE
          stamps,
          profiles,
          templates,
          users
          `
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

function seedTemplatesTables(db, users, templates) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users)
    await trx.into('templates').insert(templates)
  })
}

function seedProfilesTables(db, users, templates, profiles) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
     await seedUsers(trx, users)
     await seedTemplatesTables(trx, templates)
    await trx.into('profiles').insert(profiles)
  })
}

function seedStampsTables(db, users, stamps) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users)
    await trx.into('stamps').insert(stamps)
  })
}

// function makeExpectedTemplates(users) {
//   const author = users
//     .find(user => user.id === template.owner_id)

//   const number_of_templates = templates
//     .filter(template => comment.article_id === article.id)
//     .length

//   return {
//     id: article.id,
//     style: article.style,
//     title: article.title,
//     content: article.content,
//     date_created: article.date_created.toISOString(),
//     number_of_comments,
//     author: {
//       id: author.id,
//       user_name: author.user_name,
//       full_name: author.full_name,
//       nickname: author.nickname,
//       date_created: author.date_created.toISOString(),
//       date_modified: author.date_modified || null,
//     },
//   }
// }

module.exports = {
  makeUsersArray,
  makeProfilesArray,
  makeTemplatesArray,
  seedTemplatesTables,
  seedProfilesTables,
  seedStampsTables,
  makeFixtures,
  cleanTables,
  makeAuthHeader,
  seedUsers
}
