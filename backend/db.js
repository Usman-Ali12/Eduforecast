const { Pool } = require("pg");

// PostgreSQL connection configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "EduForecast",
  password: "abc@abc@",
  port: 5432,
});

module.exports = pool;
