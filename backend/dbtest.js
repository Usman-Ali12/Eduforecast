const pool = require('./db');

async function test() {
  try {
    // Test 1: Check DB time
    const timeRes = await pool.query('SELECT NOW()');
    console.log('✅ DB connected:', timeRes.rows[0]);

    // Test 2: Check users table
    const userRes = await pool.query('SELECT * FROM users');
    console.log('✅ Users:', userRes.rows);
  } catch (error) {
    console.error('❌ DB test error:', error.message);
  }
}

test();
