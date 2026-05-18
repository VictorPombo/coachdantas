const postgres = require('postgres');
const sql = postgres('postgresql://postgres:susxen-fefqe1-faMdoc@db.wwrjwodmbzdaqfqzrrka.supabase.co:5432/postgres', { ssl: 'require' });

async function check() {
  try {
     const res = await sql`SELECT id, email FROM auth.users WHERE email = 'assis@aluno.com'`;
     console.log(res);
  } catch (e) {
     console.log(e);
  } finally {
     sql.end();
  }
}
check();
