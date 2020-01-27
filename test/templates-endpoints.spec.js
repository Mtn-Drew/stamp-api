const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Templates Endpoints', function() {
  let db

  const {
    testUsers,
    testTemplates,
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

  describe(`GET /api/templates`, () => {
    context(`Given no templates`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/templates')
          .expect(200, [])
      })
    })

    context('Given there are templates in the database', () => {
      beforeEach('insert templates', () =>
        helpers.seedTemplatesTables(
          db,
          testUsers,
          testTemplates,
 
        )
      )

      it('responds with 200 and all of the templates', () => {
        const expectedTemplates = testTemplates.map(template =>
          helpers.makeExpectedTemplate(
            testUsers,
            template,

          )
        )
        return supertest(app)
          .get('/api/templates')
          .expect(200, expectedTemplates)
      })
    })

    describe(`GET /api/templates/:template_id`, () => {
      context(`Given no templates`, () => {
        beforeEach(() =>
          helpers.seedUsers(db, testUsers)
        )
  
        it(`responds with 404`, () => {
          const templateId = 123456
          return supertest(app)
            .get(`/api/templates/${templateId}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(404, { error: `Template doesn't exist` })
        })
      })
  
      context('Given there are templates in the database', () => {
        beforeEach('insert templates', () =>
          helpers.seedTemplatesTables(
            db,
            testUsers,
            testTemplates,
            testComments,
          )
        )
  
        it('responds with 200 and the specified template', () => {
          const templateId = 2
          const expectedTemplate = helpers.makeExpectedTemplate(
            testUsers,
            testTemplates[templateId - 1],
            testComments,
          )
  
          return supertest(app)
            .get(`/api/templates/${templateId}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedTemplate)
        })
      })
  
      
    })

  })
})