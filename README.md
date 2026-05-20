# Coach Dantas

Uma plataforma premium de gerenciamento de treinamento, CRM de alunos, acompanhamento de frequência, controle de conquistas (gamificação), evolução física e controle financeiro, projetada especificamente para otimizar o fluxo de trabalho de treinadores e alunos.

## 🚀 Tecnologias

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL com RLS e migrações estruturadas)
- **Autenticação**: Supabase Auth com proteção de rotas integrada via middleware por roles (`admin`, `student`)
- **Estilização**: CSS moderno e responsivo, adaptado perfeitamente para desktop e dispositivos móveis

---

## ⚡ Principais Funcionalidades

### 1. Painel Administrativo (Admin)
- **Dashboard Resumido**: Métricas de alunos ativos, faturamento mensal estimado, quantidade de aulas do dia e controle de pagamentos pendentes.
- **CRM de Alunos**: Lista completa com filtros de busca, histórico de última aula e status financeiro ("Em dia", "Atrasado", "Cancelado").
- **Agenda & Grade**: Visualização detalhada das aulas diárias por modalidade e lista de alunos confirmados por data.
- **Detalhes de Alunos**: Notas personalizadas do coach, evolução física recente e conquistas conquistadas.
- **Controle Financeiro**: Gestão de entradas estimadas e acompanhamento detalhado de inadimplência.

### 2. Painel do Aluno
- **Dashboard Customizado**: Mensagem de boas-vindas dinâmica, cálculo de streak de treinos e próxima aula agendada.
- **Evolução Física**: Histórico de peso com visualização gráfica e radar de habilidades (força, mobilidade, endurance).
- **Gamificação & Badges**: Sistema de conquistas integrado com XP e recompensas para incentivar a regularidade dos treinos.
- **Perfil do Aluno**: Informações sobre plano ativo, ciclo de faturamento e status de pagamento.

---

## 🛠️ Como Iniciar o Desenvolvimento

### 1. Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto e configure as seguintes chaves de acesso ao Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sua-url-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### 2. Rodar o Servidor Local

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a plataforma.
