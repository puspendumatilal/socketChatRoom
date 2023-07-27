import {Pool} from 'pg'

// Create a PostgreSQL pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imedisync',
  password: 'admin',
  port: 5432,
})

export default pool
