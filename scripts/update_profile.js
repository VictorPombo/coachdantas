const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function update() {
  const { data, error } = await supabase.from('profiles').update({ full_name: 'Leandro Dantas' }).eq('id', 'ce1601f3-294f-4625-9136-533096d62306');
  console.log('Error:', error);
}
update();
