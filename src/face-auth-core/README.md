# FaceAuthCore

FaceAuthCore é um módulo de reconhecimento facial agnóstico e independente, construído para facilitar a autenticação biométrica no navegador usando `face-api.js` (com o modelo `ssdMobilenetv1`) integrado nativamente com **Supabase** e **pgvector**.

## Características
- **Captura Resiliente**: Avalia a iluminação do ambiente e calcula a média vetorial de múltiplos frames para gerar embeddings mais precisos.
- **Processamento Local (Client-Side)**: A extração do vetor facial ocorre 100% no navegador do usuário. Apenas um array matemático (128 posições) é enviado ao servidor.
- **Armazenamento Seguro**: Usa a extensão `vector` do PostgreSQL e comparações baseadas em Distância Euclidiana no backend (Server-Side).
- **Sem Dependências Acopladas**: Totalmente desvinculado de regras de negócio específicas, podendo ser usado para catracas, login, confirmação de aula, etc.

## Setup Inicial

1. Instale as dependências:
```bash
npm install @vladmandic/face-api @supabase/supabase-js
```

2. Crie as tabelas no Supabase:
Copie o conteúdo de `database/schema.sql` e execute no SQL Editor do seu projeto Supabase.

3. Configure as variáveis de ambiente:
Veja o arquivo `env.example` e copie as variáveis para o seu `.env.local`.

## Como Usar

A pasta `examples/` contém 3 fluxos de implementação práticos:
1. `login-com-facial.tsx`: Usando o componente `FaceVerifyPrompt` num fluxo de autenticação.
2. `confirmacao-aula.tsx`: Validando a presença de um aluno.
3. `qr-confirmacao.tsx`: Iniciando uma sessão QR para captura remota via celular (usando `realtime.ts`).

### Cadastrando o Rosto (Enrollment)

Você pode usar o componente de alto nível que orquestra os textos e estados visuais:
```tsx
import { FaceEnrollmentFlow } from '@/face-auth-core/components/FaceEnrollmentFlow'

<FaceEnrollmentFlow 
  userId="uuid-do-usuario" 
  onComplete={() => alert('Pronto!')} 
/>
```

### Verificando o Rosto (Verify/Login)

```tsx
import { FaceVerifyPrompt } from '@/face-auth-core/components/FaceVerifyPrompt'

<FaceVerifyPrompt 
  userId="uuid-do-usuario"
  context="login"
  onResult={(result) => {
    if (result.passed) {
      console.log('Bem vindo!', result.confidence)
    } else {
      console.log('Não reconhecido', result.distance)
    }
  }}
/>
```

## API e Rotas do Next.js

Para que os componentes Client funcionem de forma segura com o Banco de Dados, você deve mapear (exportar) as funções do diretório `api/` para as suas rotas reais no Next.js (Ex: `app/api/enroll/route.ts`).

## Troubleshooting

1. **Iluminação Baixa**: O anel ficará vermelho se o `brightness` médio for < 60. Se os usuários reclamarem, reduza esse threshold no arquivo `FaceCapture.ts`.
2. **Erro de CORS nos Modelos**: Os arquivos de modelos neurais (.json e .bin) são servidos via CDN. Caso o CDN caia, substitua a variável `NEXT_PUBLIC_FACE_MODEL_CDN` por um caminho local no seu diretório `public/models/`.
