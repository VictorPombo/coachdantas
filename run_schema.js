const postgres = require('postgres');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Conexão com o banco via postgres URL
const sql = postgres('postgresql://postgres:susxen-fefqe1-faMdoc@db.wwrjwodmbzdaqfqzrrka.supabase.co:5432/postgres', { 
  ssl: 'require',
  max: 1 // Conexão única para evitar locks ao criar a base
});

// Setup do Supabase JS para criar o usuário depois
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltando NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no ambiente.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // 1. LER E EXECUTAR O ARQUIVO SQL
    const schema = fs.readFileSync('0001_initial_schema.sql', 'utf8');
    console.log("Executando o script 0001_initial_schema.sql no banco de dados...");
    
    // Roda todo o conteúdo de uma vez
    await sql.unsafe(schema);
    console.log("✅ Estrutura de banco de dados e triggers criados com sucesso!");

    // 2. CRIAR O USUÁRIO
    console.log("Criando usuário assis@aluno.com...");
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'assis@aluno.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Assis Aluno',
        phone: '11999999999',
        role: 'student'
      }
    });

    if (authError) {
      console.error("❌ Erro ao criar o usuário:", authError.message);
    } else {
      console.log("✅ Usuário criado com sucesso com o ID:", authData.user.id);
    }

  } catch(e) {
    console.error("❌ Ocorreu um erro:", e);
  } finally {
    await sql.end();
  }
}

main();
