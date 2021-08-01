import config from "../config";
import { Pool } from "pg";

const pool = new Pool({
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost,
  port: config.dbPort,
  database: "masquerade",
});

export default pool;
