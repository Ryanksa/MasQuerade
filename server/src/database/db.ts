const Pool = require('pg').Pool;

const user = process.env.DB_USER || "postgres";
const password = process.env.DB_PASSWORD || "postgres";

const pool = new Pool({
  "user": user,
  "password": password,
  "host": "localhost",
  "port": 5432,
  "database": "masquerade"
});

export default pool;