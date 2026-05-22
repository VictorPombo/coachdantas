import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const testUsers = [
  { full_name: '[TESTE] Carlos Almeida', email: 'carlos.teste@example.com' },
  { full_name: '[TESTE] Amanda Costa', email: 'amanda.teste@example.com' },
  { full_name: '[TESTE] Roberto Silva', email: 'roberto.teste@example.com' },
  { full_name: '[TESTE] Juliana Mendes', email: 'juliana.teste@example.com' },
  { full_name: '[TESTE] Felipe Rocha', email: 'felipe.teste@example.com' },
  { full_name: '[TESTE] Vanessa Lima', email: 'vanessa.teste@example.com' },
  { full_name: '[TESTE] Gabriel Souza', email: 'gabriel.teste@example.com' }
]

async function seed() {
  console.log('Seeding test users directly into profiles...')
  
  for (const user of testUsers) {
    const fakeId = crypto.randomUUID()
    
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: fakeId,
        full_name: user.full_name,
        role: 'student'
      })

    if (profileError) {
      console.error(`Error inserting profile for ${user.email}:`, profileError.message)
    } else {
      console.log(`✅ Created test profile: ${user.full_name}`)
    }
  }
  
  console.log('Done seeding.')
}

seed()
