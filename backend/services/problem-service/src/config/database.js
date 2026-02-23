const { Sequelize } = require('sequelize');
const dns = require('dns');
const pg = require('pg');
require('dotenv').config();

// Force pg to use IPv4 only — prevents Happy Eyeballs ETIMEDOUT in Docker/WSL2
pg.defaults.lookup = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, family: 4 }, callback);
};

console.log('[problem-service] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
      },
      logging: false,
    })
  : new Sequelize('neondb', 'neondb_owner', 'npg_1hg3AXQFYyfU', {
      dialect: 'postgres',
      host: 'ep-summer-queen-aifl7d78-pooler.c-4.us-east-1.aws.neon.tech',
      port: 5432,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
      },
      logging: false,
    });

module.exports = sequelize;
