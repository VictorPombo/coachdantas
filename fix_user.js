const postgres = require('postgres');
const sql = postgres('postgresql://postgres:susxen-fefqe1-faMdoc@db.wwrjwodmbzdaqfqzrrka.supabase.co:5432/postgres', { ssl: 'require' });

async function fixUser() {
  try {
     console.log("Fixing auth.users NULL columns...");
     
     await sql`
        UPDATE auth.users
        SET 
          confirmation_token = COALESCE(confirmation_token, ''),
          recovery_token = COALESCE(recovery_token, ''),
          email_change_token_new = COALESCE(email_change_token_new, ''),
          email_change = COALESCE(email_change, '')
        WHERE email = 'assis@aluno.com';
     `;
     
     console.log("Fixed!");
  } catch (e) {
     console.log("DB ERROR:", e);
  } finally {
     sql.end();
  }
}
fixUser();
