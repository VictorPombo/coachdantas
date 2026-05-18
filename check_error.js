const postgres = require('postgres');
const sql = postgres('postgresql://postgres:susxen-fefqe1-faMdoc@db.wwrjwodmbzdaqfqzrrka.supabase.co:5432/postgres', { ssl: 'require' });

async function check() {
  try {
     await sql`INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data) 
               VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test@test.com', 'dummy', now(), '{"role": "student"}'::jsonb)`;
     console.log("Inserted fine");
  } catch (e) {
     console.log("DB ERROR:", e.message, e);
  } finally {
     sql.end();
  }
}
check();
