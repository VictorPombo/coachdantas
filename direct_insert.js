const postgres = require('postgres');
const sql = postgres('postgresql://postgres:susxen-fefqe1-faMdoc@db.wwrjwodmbzdaqfqzrrka.supabase.co:5432/postgres', { ssl: 'require' });

async function insertUser() {
  try {
     console.log("Inserting user directly into DB...");

     const [{ id }] = await sql`
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
          raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) 
        VALUES (
          '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'assis@aluno.com', 
          crypt('password123', gen_salt('bf')), now(), 
          '{"provider": "email", "providers": ["email"]}'::jsonb, 
          '{"role": "student", "full_name": "Assis Aluno", "phone": "11999999999"}'::jsonb,
          now(), now()
        )
        RETURNING id;
     `;
     
     console.log("User created in auth.users with ID:", id);
     console.log("Done.");
  } catch (e) {
     console.log("DB ERROR:", e);
  } finally {
     sql.end();
  }
}
insertUser();
