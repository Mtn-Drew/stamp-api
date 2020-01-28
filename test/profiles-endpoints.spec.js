const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Profiles Endpoints', function() {
  let db

  const {
    testUsers,
    testProfiles,
    testComments,
  } = helpers.makeFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/profiles`, () => {
    context(`Given no profiles`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/profiles')
          .expect(200, [])
      })
    })

    context('Given there are profiles in the database', () => {
      beforeEach('insert profiles', () =>
        helpers.seedProfilesTables(
          db,
          testUsers,
          testProfiles,
 
        )
      )

      it('responds with 200 and all of the profiles', () => {
        const expectedProfiles = testProfiles.map(profile =>
          helpers.makeExpectedProfile(
            testUsers,
            profile,

          )
        )
        return supertest(app)
          .get('/api/profiles')
          .expect(200, expectedProfiles)
      })
    })

    describe(`GET /api/profiles/:profile_id`, () => {
      context(`Given no profiles`, () => {
        beforeEach(() =>
          helpers.seedUsers(db, testUsers)
        )
  
        it(`responds with 404`, () => {
          const profileId = '83897c95-df74-499b-8cc9-777ee8342d0c'
          return supertest(app)
            .get(`/api/profiles/${profileId}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(404, { error: `Profile doesn't exist` })
        })
      })
  
      context('Given there are profiles in the database', () => {
        beforeEach('insert profiles', () =>
          helpers.seedProfilesTables(
            db,
            testUsers,
            testProfiles,
            testComments,
          )
        )
  
        it('responds with 200 and the specified profile', () => {
          const profileId = 2
          const expectedProfile = helpers.makeExpectedProfile(
            testUsers,
            testProfiles[profileId - 1],
            testComments,
          )
  
          return supertest(app)
            .get(`/api/profiles/${profileId}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedProfile)
        })
      })
  
      
    })

  })
})