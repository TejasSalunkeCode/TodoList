const {Client} = require('pg');

async function setup() {
  const c1 = new Client({user:'postgres', host:'localhost', database:'postgres'});
  await c1.connect();
  try {
    await c1.query('CREATE DATABASE todoo');
    console.log('Database created');
  } catch(e) {
    console.log('Database may exist:', e.message);
  }
  await c1.end();

  const c2 = new Client({user:'postgres', host:'localhost', database:'todoo'});
  await c2.connect();
  await c2.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  
  await c2.query(`CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  
  console.log('Tables created');
  await c2.end();
}

setup().catch(console.error);
