import pkg from 'pg';
const { Client } = pkg;

let client;

export async function connectDB(uri) {
  if (!uri) throw new Error('DATABASE_URL is not set');
  client = new Client({ connectionString: uri });
  await client.connect();
  console.log('PostgreSQL connected');
}

export function getClient() {
  return client;
}
