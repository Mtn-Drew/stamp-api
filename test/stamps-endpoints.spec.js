const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Stamps Endpoints', function() {
  let db

  const {
    testUsers,
    testStamps,
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

  describe(`GET /api/stamps`, () => {
    context(`Given no stamps`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/stamps')
          .expect(200, [])
      })
    })

    context('Given there are stamps in the database', () => {
      beforeEach('insert stamps', () =>
        helpers.seedStampsTables(
          db,
          testUsers,
          testStamps,
 
        )
      )

      it('responds with 200 and all of the stamps', () => {
        const expectedStamps = testStamps.map(stamp =>
          helpers.makeExpectedStamp(
            testUsers,
            stamp,

          )
        )
        return supertest(app)
          .get('/api/stamps')
          .expect(200, expectedStamps)
      })
    })

    describe(`GET /api/stamps/:stamp_id`, () => {
      context(`Given no stamps`, () => {
        beforeEach(() =>
          helpers.seedUsers(db, testUsers)
        )
  
        it(`responds with 404`, () => {
          const stampId = 123456
          return supertest(app)
            .get(`/api/stamps/${stampId}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(404, { error: `Stamp doesn't exist` })
        })
      })
  
      context('Given there are stamps in the database', () => {
        beforeEach('insert stamps', () =>
          helpers.seedStampsTables(
            db,
            testUsers,
            testStamps,
            testComments,
          )
        )
  
        it('responds with 200 and the specified stamp', () => {
          const stampId = 2
          const expectedStamp = helpers.makeExpectedStamp(
            testUsers,
            testStamps[stampId - 1],
            testComments,
          )
  
          return supertest(app)
            .get(`/api/stamps/${stampId}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedStamp)
        })
      })
  
      
    })

  })
})