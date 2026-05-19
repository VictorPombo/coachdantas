require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:susxen-fefqe1-faMdoc@db.wwrjwodmbzdaqfqzrrka.supabase.co:5432/postgres', { ssl: 'require', max: 1 });
async function run() {
  const sessions = await sql`
    SELECT s.created_at, s.passed, s.distance, u.email 
    FROM login_sessions s 
    JOIN auth.users u ON s.user_id = u.id 
    ORDER BY s.created_at DESC LIMIT 5
  `;
  console.log(sessions);
  await sql.end();
}
run();
