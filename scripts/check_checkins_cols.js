const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function cols() {
  const { data, error } = await supabase.from('checkins').insert({ class_id: 'test' }).select();
  console.log('Error:', error);
}
cols();
