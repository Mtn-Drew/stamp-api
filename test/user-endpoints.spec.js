const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
  let db

  const { testUsers } = helpers.makeFixtures()
  const testUser = testUsers[0]

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

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

      const requiredFields = ['user_name', 'password', 'email']

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          user_name: 'test user_name',
          password: 'test password',
          email: 'test email'
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`
            })
        })
      })
    })
  })
  context(`Happy path`, () => {
    it(`responds 201, storing bcryped password`, () => {
      const newUser = {
        user_name: 'test user_name',
        password: 'test password',
        email: 'test email'
      }
      return supertest(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property('id')
          expect(res.body.user_name).to.eql(newUser.user_name)

          expect(res.body).to.not.have.property('password')
          expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
          const expectedDate = new Date().toLocaleString('en', {
            timeZone: 'UTC'
          })
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect((res) =>
          db
            .from('users')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then((row) => {
              expect(row.user_name).to.eql(newUser.user_name)

              const expectedDate = new Date().toLocaleString('en', {
                timeZone: 'UTC'
              })
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)

              return bcrypt.compare(newUser.password, row.password)
            })
            .then((compareMatch) => {
              expect(compareMatch).to.be.true
            })
        )
    })
  })
})
