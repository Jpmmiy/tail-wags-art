import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function run() {
  const email = 'lucaon.lc@gmail.com'
  const password = '12345678'

  console.log('Tentando criar usuário:', email)
  
  const { data: userRecord, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { created_manually: true }
  })

  let userId = userRecord?.user?.id

  if (authError?.message.includes('already registered')) {
    console.log('Usuário já existe, buscando ID...')
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    const user = users?.users.find(u => u.email === email)
    userId = user?.id
    
    if (userId) {
      console.log('Atualizando senha do usuário existente...')
      await supabase.auth.admin.updateUserById(userId, { password })
    }
  } else if (authError) {
    console.error('Erro Auth:', authError.message)
    return
  }

  if (!userId) {
    console.error('Não foi possível obter o ID do usuário')
    return
  }

  console.log('ID do usuário:', userId)

  console.log('Configurando perfil vitalicio...')
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email: email,
    tier: 'vitalicio',
    credits: 9999,
    updated_at: new Date().toISOString()
  })

  if (profileError) {
    console.error('Erro Perfil:', profileError.message)
  } else {
    console.log('Perfil atualizado com sucesso!')
  }

  console.log('Garantindo roles...')
  await supabase.from('user_roles').upsert({
    user_id: userId,
    role: 'user'
  })
  
  console.log('FINALIZADO.')
}

run()
