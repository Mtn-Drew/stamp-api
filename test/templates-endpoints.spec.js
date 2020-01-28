const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Templates Endpoints', function() {
  let db

  const { testUsers, testTemplates } = helpers.makeFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
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
        helpers.seedTemplatesTables(db, testUsers, testTemplates)
      )

      it('responds with 200 and all of the templates', () => {
        const expectedTemplates = testTemplates
        // .map((template) =>
        //   helpers.makeExpectedTemplate(testUsers, template)
        // )
        return supertest(app)
          .get('/api/templates')
          .expect(200, expectedTemplates)
      })
    })

    describe(`GET /api/templates/:template_id`, () => {
      context(`Given no templates`, () => {
        beforeEach(() => helpers.seedUsers(db, testUsers))

        it(`responds with 404`, () => {
          const templateId = '83897c95-df74-499b-8cc9-777ee8342d0c'
          return supertest(app)
            .get(`/api/templates/${templateId}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(404, { error: `Template doesn't exist` })
        })
      })

      context('Given there are templates in the database', () => {
        beforeEach('insert templates', () =>
          helpers.seedTemplatesTables(db, testUsers, testTemplates)
        )

        it('responds with 200 and the specified template', () => {
          const templateId = 'c5d5b2f3-4b3f-47a0-8563-4606e2c8b559'
          const expectedTemplate = testTemplates[0]
          //helpers.makeExpectedTemplate(
          //   testUsers,
          //   testTemplates[templateId - 1]
          // )

          return supertest(app)
            .get(`/api/templates/${templateId}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200)
        })
      })
    })
  })
 })
