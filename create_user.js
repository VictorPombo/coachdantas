const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Creating user assis@aluno.com with email_confirm: false...");
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'assis@aluno.com',
    password: 'password123',
    email_confirm: true, // we can't change it via api if project settings restrict it, wait, we can pass email_confirm: false
    user_metadata: {
      full_name: 'Assis Aluno',
      phone: '11999999999',
      role: 'student'
    }
  });

  if (authError) {
    console.error("Error creating user:", authError);
    // try with email_confirm: false
    console.log("Trying with email_confirm: false...");
    const { data: authData2, error: authError2 } = await supabase.auth.admin.createUser({
      email: 'assis@aluno.com',
      password: 'password123',
      email_confirm: false,
      user_metadata: {
        full_name: 'Assis Aluno',
        phone: '11999999999',
        role: 'student'
      }
    });
    if (authError2) {
      console.error("Still error:", authError2);
    } else {
      console.log("Auth user created with ID:", authData2.user.id);
    }
    return;
  }

  console.log("Auth user created with ID:", authData.user.id);
}

main();
