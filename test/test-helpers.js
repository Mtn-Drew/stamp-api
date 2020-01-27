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
    },
    {
      id: '69060492-5f7f-48c5-97ab-81ce4716b172',
      user_name: 'test-user-2',
      email: 'email@email.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: '77a85732-28f8-41ee-a420-477cc3b69260',
      user_name: 'test-user-3',
      email: 'email@email.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 'ec67c643-2cf4-4a4c-aa55-cb805c3066ba',
      user_name: 'test-user-4',
      email: 'email@email.com',
      password: 'password',
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
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: 'c0cc8ec3-8ae7-440e-80bc-e6f35235176c',
      title: 'Second title',
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: '14d17924-f028-4584-92bb-2691ef24580a',
      title: 'Third title',
      owner_id: users[1].id,
      archived: '',
      write: '',
      disp_ord: ''
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
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: '21223390-6fdf-4e3c-b85a-a697109e0b2d',
      title: 'Profile 2',
      template_id: templates[0].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: '690a4d5c-52e9-4512-91c9-6ad50641d8e5',
      title: 'Profile 3',
      template_id: templates[1].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: 'a4758f24-bf74-479c-a476-746518584af0',
      title: 'Profile 4',
      template_id: templates[0].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: 'a4758f24-bf74-479c-a476-746518584af0',
      title: 'Profile 5',
      template_id: templates[2].id,
      owner_id: users[1].id,
      archived: '',
      write: '',
      disp_ord: ''
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
      disp_ord: ''
    },
    {
      id: '0072a5de-4c20-45c5-bae4-179dca8a8930',
      title: 'Stamp 2',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, quas?',
      template_id: templates[0].id,
      profile_id: profiles[0].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: '',
      title: 'Stamp 3',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, quas?',
      template_id: templates[0].id,
      profile_id: profiles[1].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: '0072a5de-4c20-45c5-bae4-179dca8a8930',
      title: 'Stamp 4',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, quas?',
      template_id: templates[0].id,
      profile_id: profiles[1].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: '59b9b9ee-03cf-4d95-80e6-09f3c96c2c22',
      title: 'Stamp 5',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, quas?',
      template_id: templates[0].id,
      profile_id: profiles[2].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: 'd9b8b3c0-57ed-4407-949f-c4e1580cb3df',
      title: 'Stamp 6',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, quas?',
      template_id: templates[0].id,
      profile_id: profiles[2].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: 'ecb17cb1-9194-4304-8753-cad6de279039',
      title: 'Stamp 7',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, quas?',
      template_id: templates[0].id,
      profile_id: profiles[3].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: '83356bc8-9d17-4166-a819-77529b8eda73',
      title: 'Stamp 8',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, quas?',
      template_id: templates[0].id,
      profile_id: profiles[3].id,
      owner_id: users[0].id,
      archived: '',
      write: '',
      disp_ord: ''
    },
    {
      id: '19a13ca9-3e6a-4c4b-8037-2511e6c8d423',
      title: 'Stamp 9',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, quas?',
      template_id: templates[2].id,
      profile_id: profiles[4].id,
      owner_id: users[1].id,
      archived: '',
      write: '',
      disp_ord: ''
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
    // update the auto sequence to match the forced id values
  })
}

function seedProfilesTables(db, users, profiles) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users)
    await trx.into('profiles').insert(profiles)
    // update the auto sequence to match the forced id values
  })
}

function seedStampsTables(db, users, stamps) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users)
    await trx.into('stamps').insert(stamps)
    // update the auto sequence to match the forced id values
  })
}

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
