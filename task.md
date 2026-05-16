# Coach Dantas — Guia de Execução: Fase 0 (Frontend → Banco Real)

> **Contexto**: O banco de dados já está rodando no Supabase com todas as tabelas, RLS e seed data.
> Este documento detalha EXATAMENTE o que precisa ser feito para conectar o frontend ao banco real.
> Siga na ordem. Cada tarefa depende da anterior.

---

## TAREFA 1: Ativar Autenticação Real

### 1.1 — Ativar o middleware de sessão

**Arquivo**: `src/middleware.ts`

O middleware atual está desativado (bypass). Precisa ativar o `updateSession` e adicionar proteção de rotas baseada em role.

```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### 1.2 — Adicionar proteção de rotas no middleware do Supabase

**Arquivo**: `src/utils/supabase/middleware.ts`

Descomentar o bloco de redirecionamento e adicionar lógica de role. O trecho comentado já existe — substituir por:

```ts
// Após o getUser()...

const pathname = request.nextUrl.pathname;

// Se não logado e tentando acessar áreas protegidas → login
if (!user && (pathname.startsWith('/admin') || pathname.startsWith('/aluno'))) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

// Se logado, buscar a role para roteamento
if (user) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Admin tentando acessar área de aluno → redireciona pro admin
  if (profile?.role === 'admin' && pathname.startsWith('/aluno')) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // Aluno tentando acessar área admin → redireciona pro aluno
  if (profile?.role === 'student' && pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/aluno';
    return NextResponse.redirect(url);
  }

  // Se logado e acessando /login → redireciona pra área correta
  if (pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = profile?.role === 'admin' ? '/admin' : '/aluno';
    return NextResponse.redirect(url);
  }
}
```

### 1.3 — Reescrever a tela de Login

**Arquivo**: `src/app/login/page.tsx`

Substituir os botões "Entrar como Aluno/Admin" por um formulário real de email + senha usando Supabase Auth.

```
- Campo: E-mail
- Campo: Senha
- Botão: "Entrar"
- Ação: supabase.auth.signInWithPassword({ email, password })
- Após login, o middleware cuida do redirecionamento por role.
- Exibir mensagem de erro se credenciais inválidas.
- Manter o visual/design atual (brand-support, brand-accent, etc.)
```

### 1.4 — Adicionar logout real nos layouts

**Arquivos**: `src/app/admin/layout.tsx` e `src/app/aluno/layout.tsx`

O botão "Sair" nos dois layouts atualmente faz `<Link href="/login">`. Trocar por uma função que faz signOut:

```ts
const handleLogout = async () => {
  const supabase = createClient(); // do client.ts
  await supabase.auth.signOut();
  router.push('/login');
};
```

---

## TAREFA 2: Criar os hooks/funções de dados reutilizáveis

Antes de sair editando cada página, criar funções centralizadas que buscam os dados do Supabase.
Isso evita repetir queries em todo lugar.

### 2.1 — Criar `src/lib/queries.ts`

Arquivo com funções server-side que fazem as queries ao banco.
Cada função retorna dados tipados. Exemplos:

```ts
import { createClient } from "@/utils/supabase/server";

// ========================
// PERFIL DO USUÁRIO LOGADO
// ========================
export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*, subscriptions(*, plans(*))')
    .eq('id', user.id)
    .single();

  return data;
}

// ========================
// DASHBOARD ADMIN — Cards de resumo
// ========================
export async function getAdminDashboardStats() {
  const supabase = await createClient();

  // Total de alunos ativos (têm assinatura active)
  const { count: totalAlunos } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Pagamentos pendentes (past_due)
  const { data: inadimplentes } = await supabase
    .from('subscriptions')
    .select('profile_id, plans(price)')
    .eq('status', 'past_due');

  const totalPendente = inadimplentes?.reduce(
    (sum, s) => sum + (s.plans?.price || 0), 0
  ) || 0;

  // Faturamento do mês (assinaturas ativas × preço do plano)
  const { data: ativos } = await supabase
    .from('subscriptions')
    .select('plans(price)')
    .eq('status', 'active');

  const faturamento = ativos?.reduce(
    (sum, s) => sum + (s.plans?.price || 0), 0
  ) || 0;

  return {
    totalAlunos: totalAlunos || 0,
    pagamentosPendentes: inadimplentes?.length || 0,
    valorPendente: totalPendente,
    faturamentoMes: faturamento,
  };
}

// ========================
// DASHBOARD ADMIN — Aulas de hoje
// ========================
export async function getClassesToday() {
  const supabase = await createClient();

  // Mapear dia da semana JS (0=Dom) para o ENUM do banco
  const weekdayMap = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const today = weekdayMap[new Date().getDay()];
  const todayDate = new Date().toISOString().split('T')[0];

  const { data: classes } = await supabase
    .from('classes')
    .select(`
      *,
      modalities(name),
      class_enrollments(
        profile_id,
        profiles(full_name),
        status
      )
    `)
    .eq('weekday', today)
    .eq('is_active', true)
    .eq('class_enrollments.class_date', todayDate)
    .eq('class_enrollments.status', 'confirmed')
    .order('start_time');

  return classes || [];
}

// ========================
// DASHBOARD ADMIN — Alertas (inadimplentes + inativos)
// ========================
export async function getAdminAlerts() {
  const supabase = await createClient();

  // Inadimplentes
  const { data: inadimplentes } = await supabase
    .from('subscriptions')
    .select('profile_id, profiles(full_name, phone), plans(price), current_period_end')
    .eq('status', 'past_due');

  // Inativos (último check-in > 15 dias)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 15);

  const { data: allStudents } = await supabase
    .from('profiles')
    .select(`
      id, full_name, phone,
      checkins(checked_in_at)
    `)
    .eq('role', 'student')
    .order('checked_in_at', { referencedTable: 'checkins', ascending: false })
    .limit(1, { referencedTable: 'checkins' });

  const inativos = allStudents?.filter(s => {
    const lastCheckin = s.checkins?.[0]?.checked_in_at;
    return !lastCheckin || new Date(lastCheckin) < cutoff;
  }) || [];

  return {
    inadimplentes: inadimplentes || [],
    valorTotal: inadimplentes?.reduce((sum, s) => sum + (s.plans?.price || 0), 0) || 0,
    inativos,
  };
}

// ========================
// LISTA DE ALUNOS (Admin)
// ========================
export async function getAlunos(search?: string, modalidade?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select(`
      id, full_name, role, phone,
      subscriptions(status, plans(name, modalities(name))),
      checkins(checked_in_at)
    `)
    .eq('role', 'student')
    .order('checked_in_at', { referencedTable: 'checkins', ascending: false })
    .limit(1, { referencedTable: 'checkins' });

  if (search) {
    query = query.ilike('full_name', `%${search}%`);
  }

  const { data } = await query;
  return data || [];
}

// ========================
// DASHBOARD ALUNO — Streak de check-ins
// ========================
export async function getStudentStreak(profileId: string) {
  const supabase = await createClient();

  const { data: checkins } = await supabase
    .from('checkins')
    .select('checked_in_at')
    .eq('profile_id', profileId)
    .order('checked_in_at', { ascending: false });

  if (!checkins?.length) return 0;

  // Calcular streak: dias consecutivos de treino (conta semanas, não dias corridos)
  // Lógica simplificada: conta check-ins em semanas consecutivas
  let streak = 0;
  const dates = checkins.map(c => new Date(c.checked_in_at).toISOString().split('T')[0]);
  const uniqueDates = [...new Set(dates)];

  // Conta sequência de dias com treino (gap máximo de 2 dias entre treinos = mesma streak)
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) { streak = 1; continue; }
    const curr = new Date(uniqueDates[i]);
    const prev = new Date(uniqueDates[i - 1]);
    const diffDays = Math.abs((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) { streak++; } else { break; }
  }

  return streak;
}

// ========================
// DASHBOARD ALUNO — Próxima aula
// ========================
export async function getNextClass(profileId: string) {
  const supabase = await createClient();

  // Buscar assinatura ativa do aluno para saber a modalidade
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plans(modality_id, modalities(name))')
    .eq('profile_id', profileId)
    .eq('status', 'active')
    .single();

  if (!sub) return null;

  const weekdayMap = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const today = weekdayMap[new Date().getDay()];
  const now = new Date().toTimeString().slice(0, 5); // HH:MM

  // Buscar próxima aula da modalidade do aluno (hoje depois de agora, ou próximo dia)
  const { data: classes } = await supabase
    .from('classes')
    .select('*, modalities(name)')
    .eq('modality_id', sub.plans?.modality_id)
    .eq('is_active', true)
    .order('start_time');

  // Encontrar a próxima aula (hoje ou próximo dia da semana)
  return classes?.[0] || null;
}

// ========================
// ALUNO — Evolução (avaliações)
// ========================
export async function getStudentAssessments(profileId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('assessments')
    .select('*')
    .eq('profile_id', profileId)
    .order('assessed_at', { ascending: true });

  return data || [];
}

// ========================
// ALUNO — Conquistas
// ========================
export async function getStudentAchievements(profileId: string) {
  const supabase = await createClient();

  // Todas as conquistas do sistema
  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_active', true);

  // Conquistas desbloqueadas pelo aluno
  const { data: unlocked } = await supabase
    .from('profile_achievements')
    .select('achievement_id, unlocked_at')
    .eq('profile_id', profileId);

  const unlockedIds = new Set(unlocked?.map(u => u.achievement_id) || []);

  // Total XP
  const totalXP = unlocked?.reduce((sum, u) => {
    const ach = allAchievements?.find(a => a.id === u.achievement_id);
    return sum + (ach?.xp_reward || 0);
  }, 0) || 0;

  return {
    achievements: allAchievements?.map(a => ({
      ...a,
      unlocked: unlockedIds.has(a.id),
    })) || [],
    totalUnlocked: unlockedIds.size,
    totalXP,
  };
}

// ========================
// ALUNO — Perfil completo (com plano e pagamento)
// ========================
export async function getStudentProfile(profileId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('profiles')
    .select(`
      *,
      subscriptions(
        status, current_period_end,
        plans(name, price, billing_cycle, max_sessions, modalities(name))
      )
    `)
    .eq('id', profileId)
    .single();

  return data;
}

// ========================
// FINANCEIRO ADMIN
// ========================
export async function getFinanceiroData() {
  const supabase = await createClient();

  // Entradas do mês (assinaturas ativas × preço)
  const { data: ativas } = await supabase
    .from('subscriptions')
    .select('plans(price)')
    .eq('status', 'active');

  const entradas = ativas?.reduce((s, a) => s + (a.plans?.price || 0), 0) || 0;

  // Inadimplentes
  const { data: pendentes } = await supabase
    .from('subscriptions')
    .select('profiles(full_name), plans(price), current_period_end')
    .eq('status', 'past_due');

  const inadimplencia = pendentes?.reduce((s, p) => s + (p.plans?.price || 0), 0) || 0;

  return {
    entradas,
    inadimplencia,
    qtdInadimplentes: pendentes?.length || 0,
    pendentes: pendentes || [],
  };
}
```

> **NOTA**: Estas são queries iniciais. Conforme conectar cada tela, ajustar os selects para trazer exatamente os campos necessários.

---

## TAREFA 3: Conectar o Dashboard Admin

**Arquivo**: `src/app/admin/page.tsx`

Este é o arquivo mais importante — é a primeira tela que o admin vê.

### O que mudar:
1. Transformar de componente client em **Server Component** (remover "use client" se tiver, importar as queries).
2. Substituir os números fixos (84, 12, R$ 28k, 3) por chamadas às funções criadas na Tarefa 2.
3. Substituir o array fixo de aulas por `getClassesToday()`.
4. Substituir o bloco de alertas fixo por `getAdminAlerts()`.

### Mapeamento dos dados mockados → queries:

| Dado mockado atual     | Substituir por                          |
|------------------------|-----------------------------------------|
| `84` (alunos ativos)   | `stats.totalAlunos`                     |
| `12` (aulas hoje)      | `classesToday.length`                   |
| `R$ 28k` (faturamento) | `formatCurrency(stats.faturamentoMes)`  |
| `3` (pgtos pendentes)  | `stats.pagamentosPendentes`             |
| Array de aulas fixo    | `classesToday` (map com dados reais)    |
| Alertas fixos          | `alerts.inadimplentes` e `alerts.inativos` |

### Função auxiliar para formatar moeda:
```ts
function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    .replace('R$\u00A0', 'R$ ');
}
```

---

## TAREFA 4: Conectar a Lista de Alunos (Admin)

**Arquivo**: `src/app/admin/alunos/page.tsx`

### O que mudar:
1. Substituir o array `alunos` fixo por `getAlunos()`.
2. Implementar busca real no campo de pesquisa (pode ser client-side filtrando o array ou com searchParams).
3. Mapear os campos:

| Coluna da tabela  | Campo do banco                                  |
|-------------------|-------------------------------------------------|
| Nome              | `profile.full_name`                              |
| Modalidade        | `profile.subscriptions[0].plans.modalities.name` |
| Última Aula       | `profile.checkins[0].checked_in_at` (formatado)  |
| Pagamento         | `profile.subscriptions[0].status`                |

### Status de pagamento → badge visual:
```
'active'   → verde  "Em dia"
'past_due' → vermelho "Atrasado"
'canceled' → cinza  "Cancelado"
'trial'    → amarelo "Trial"
```

---

## TAREFA 5: Conectar o Dashboard do Aluno

**Arquivo**: `src/app/aluno/page.tsx`

### O que mudar:
1. Buscar o perfil logado via `getCurrentProfile()`.
2. Buscar streak via `getStudentStreak(profile.id)`.
3. Buscar próxima aula via `getNextClass(profile.id)`.
4. Buscar XP/nível via `getStudentAchievements(profile.id)`.

### Mapeamento:

| Dado mockado                | Substituir por                    |
|-----------------------------|-----------------------------------|
| "Bora treinar, Victor!"     | `Bora treinar, ${profile.full_name.split(' ')[0]}!` |
| "3 dias nessa semana"       | Contar check-ins da semana atual  |
| `12` (treinos seguidos)     | `streak`                          |
| `Meta: 15`                  | Próximo achievement de streak      |
| `18:00` (próxima aula)      | `nextClass.start_time`            |
| "Funcional Inteligente"     | `nextClass.modalities.name`       |
| "Guerreiro" / "2.450 XP"   | Calcular nível baseado no XP total |
| Mural do Coach              | `profile.coach_notes` (se existir) |

### Tabela de níveis (sugestão — pode ficar como constante no frontend):
```ts
const LEVELS = [
  { name: 'Novato',     emoji: '🌱', minXP: 0 },
  { name: 'Guerreiro',  emoji: '🗡️', minXP: 1000 },
  { name: 'Gladiador',  emoji: '🛡️', minXP: 3500 },
  { name: 'Lendário',   emoji: '👑', minXP: 7000 },
  { name: 'Imortal',    emoji: '⚡', minXP: 15000 },
];
```

---

## TAREFA 6: Conectar a Evolução do Aluno

**Arquivo**: `src/app/aluno/evolucao/page.tsx`

### O que mudar:
1. Buscar avaliações via `getStudentAssessments(profile.id)`.
2. Montar o gráfico de peso com dados reais (cada barra = uma avaliação).
3. Montar o radar de skills com a avaliação mais recente.
4. Montar o histórico com a lista de avaliações.

### Mapeamento:

| Dado mockado           | Substituir por                        |
|------------------------|---------------------------------------|
| Barras fixas 85/83/80/78 | `assessments.map(a => a.weight_kg)` |
| "Meta: 75kg"           | `profile.goal` ou um campo futuro     |
| Skills 80%/60%/95%     | Última avaliação: `skill_strength`, `skill_mobility`, `skill_endurance` |
| Timeline               | `assessments.map(a => ({ date: a.assessed_at, notes: a.notes }))` |

---

## TAREFA 7: Conectar as Conquistas do Aluno

**Arquivo**: `src/app/aluno/conquistas/page.tsx`

### O que mudar:
1. Buscar via `getStudentAchievements(profile.id)`.
2. Substituir o array `badges` fixo pelos dados reais.

### Mapeamento:

| Dado mockado           | Substituir por              |
|------------------------|-----------------------------|
| Array de 6 badges fixo | `achievements` (com flag `unlocked`) |
| "3 de 25"              | `${totalUnlocked} de ${achievements.length}` |
| XP e próximo nível     | `totalXP` + calcular com tabela LEVELS |

---

## TAREFA 8: Conectar o Perfil do Aluno

**Arquivo**: `src/app/aluno/perfil/page.tsx`

### O que mudar:
1. Buscar via `getStudentProfile(profile.id)`.
2. Substituir dados fixos:

| Dado mockado              | Substituir por                                |
|---------------------------|-----------------------------------------------|
| "Victor Assis"            | `profile.full_name`                           |
| "Guerreiro 🗡️ • 2.450 XP"| Calcular com tabela LEVELS                    |
| "Funcional Inteligente"   | `profile.subscriptions[0].plans.modalities.name` |
| "3x por semana"           | `profile.subscriptions[0].plans.max_sessions` + "x por semana" |
| "R$ 516,00"               | `formatCurrency(profile.subscriptions[0].plans.price)` |
| "Pagamento em dia"        | Baseado em `profile.subscriptions[0].status`  |
| Inicial "V" no avatar     | `profile.full_name.charAt(0)`                 |

---

## TAREFA 9: Conectar o Financeiro Admin

**Arquivo**: `src/app/admin/financeiro/page.tsx`

### O que mudar:
1. Buscar via `getFinanceiroData()`.
2. Substituir:

| Dado mockado      | Substituir por                |
|-------------------|-------------------------------|
| R$ 28.500         | `formatCurrency(entradas)`    |
| R$ 4.200          | (despesas — manter mockado por enquanto, não temos tabela de despesas) |
| R$ 24.300         | `entradas - 4200` (placeholder até ter despesas reais) |
| R$ 1.548          | `formatCurrency(inadimplencia)` |
| "3 alunos"        | `qtdInadimplentes`            |
| Lista de "a receber" | `pendentes.map(...)` com dados reais |

> **NOTA**: Transações e despesas não têm tabela ainda. Manter mockados e sinalizar como "em breve" ou criar uma tabela `transactions` na próxima iteração.

---

## TAREFA 10: Conectar a Agenda Admin

**Arquivo**: `src/app/admin/agenda/page.tsx`

### O que mudar:
1. Buscar aulas do dia selecionado usando query similar a `getClassesToday()` mas parametrizada por data.
2. Substituir o array fixo de aulas por dados reais.
3. Os nomes dos alunos em cada aula vêm de `class_enrollments` filtrados pela data.

---

## TAREFA 11: Conectar o Detalhe do Aluno (Admin)

**Arquivo**: `src/app/admin/alunos/[id]/page.tsx`

### O que mudar:
1. Receber o `id` do aluno pela URL (já funciona via `[id]`).
2. Buscar o perfil completo: `profiles + subscriptions + plans + modalities`.
3. Buscar as últimas conquistas: `profile_achievements + achievements`.
4. Buscar avaliações para os skills: `assessments` (última).
5. Carregar `coach_notes` no textarea e implementar o botão "Salvar Nota" com `UPDATE profiles SET coach_notes = ...`.

---

## ORDEM DE EXECUÇÃO RECOMENDADA

```
1. Tarefa 1 (Auth)          → Sem isso, nada funciona
2. Tarefa 2 (Queries)       → Base para todas as telas
3. Tarefa 3 (Dashboard Admin) → Validação imediata de que os dados estão fluindo
4. Tarefa 5 (Dashboard Aluno) → Validação do lado do aluno
5. Tarefa 4 (Lista Alunos)  → CRUD básico
6. Tarefa 8 (Perfil Aluno)  → Dados pessoais
7. Tarefa 6 (Evolução)      → Gráficos
8. Tarefa 7 (Conquistas)    → Gamificação
9. Tarefa 9 (Financeiro)    → Dinheiro
10. Tarefa 10 (Agenda)      → Grade
11. Tarefa 11 (Detalhe)     → Ficha do aluno
```

---

## CHECKLIST DE VALIDAÇÃO

Após conectar cada tela, testar:

- [ ] Login com email do admin → vai pro /admin
- [ ] Login com email do aluno → vai pro /aluno
- [ ] Admin vê número real de alunos (3 do seed)
- [ ] Admin vê aulas do dia correto (baseado no dia da semana)
- [ ] Admin vê alertas reais (Marina e Diego como inadimplentes)
- [ ] Aluno Victor vê streak de 12
- [ ] Aluno Victor vê "Treino A - Força" e "Treino B"
- [ ] Aluno Victor vê 3 conquistas desbloqueadas de 6
- [ ] Aluno Victor vê gráfico de peso: 85 → 83 → 80 → 78
- [ ] Aluno Marina vê status "pendente" no perfil
- [ ] Botão "Sair" faz logout real e volta pro /login
- [ ] Aluno NÃO consegue acessar /admin (redireciona)
- [ ] Admin NÃO consegue acessar /aluno (redireciona)

---

## NOTAS IMPORTANTES

1. **NÃO apagar o design/CSS existente.** Apenas trocar os dados de dentro. A identidade visual já está validada.

2. **Server Components vs Client Components**: As páginas que só exibem dados podem ser Server Components (sem "use client"). Páginas que precisam de interatividade (busca, tabs, botões) precisam ser Client Components — nesse caso, buscar os dados num Server Component pai e passar via props.

3. **Variáveis de ambiente**: Confirmar que `.env.local` tem:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
   SUPABASE_SERVICE_ROLE_KEY=eyJhb...  (para criar usuários via Admin API)
   ```

4. **Os DROPs no topo da migration são para DESENVOLVIMENTO APENAS.** Remover antes de qualquer deploy em produção.
