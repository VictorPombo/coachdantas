const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'triggertest@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: {
      full_name: 'Trigger Test',
      role: 'student'
    }
  });
  console.log(error ? error : 'Success: ' + data.user.id);
}
check();
