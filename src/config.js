module.exports = {
  
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgresql@localhost/stamp',
  JWT_SECRET: process.env.JWT_SECRET || 'test-jwt-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '30d',
}
