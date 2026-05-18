const postgres = require('postgres');
const sql = postgres('postgresql://postgres:susxen-fefqe1-faMdoc@db.wwrjwodmbzdaqfqzrrka.supabase.co:5432/postgres', { ssl: 'require' });

async function reload() {
  try {
     console.log("Reloading schema cache...");
     await sql`NOTIFY pgrst, 'reload schema'`;
     console.log("Schema cache reloaded successfully!");
  } catch (e) {
     console.log("DB ERROR:", e);
  } finally {
     sql.end();
  }
}
reload();
