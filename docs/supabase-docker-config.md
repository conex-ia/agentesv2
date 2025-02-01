# Configuração do Supabase no Docker

Este documento contém as instruções e configurações necessárias para configurar corretamente o Supabase em um ambiente Docker.

## 1. Variáveis de Ambiente no Portainer
```yaml
environment:
  - VITE_SUPABASE_URL=https://seu-projeto.supabase.co
  - VITE_SUPABASE_KEY=sua-chave-anonima
  - VITE_MINIO_ENDPOINT=https://seu-endpoint
  - VITE_BACKEND_URL=https://seu-backend
  - VITE_MINIATURA=https://url-da-miniatura
  - VITE_URLINFO=Software sob medida
  - VITE_TITULO=ConexIA
  - VITE_FAVICON=https://url-do-favicon
  - VITE_DESCRICAO=Sua descrição
```

## 2. No Dockerfile
```dockerfile
# Criar template para variáveis de ambiente
RUN echo 'window.env = { \
    supabaseUrl: "${VITE_SUPABASE_URL}", \
    supabaseKey: "${VITE_SUPABASE_KEY}", \
    MINIATURA: "${VITE_MINIATURA}", \
    URLINFO: "${VITE_URLINFO}", \
    TITULO: "${VITE_TITULO}", \
    FAVICON: "${VITE_FAVICON}", \
    DESCRICAO: "${VITE_DESCRICAO}", \
    MINIO_ENDPOINT: "${VITE_MINIO_ENDPOINT}", \
    BACKEND_URL: "${VITE_BACKEND_URL}", \
    MINIO_ACCESS_KEY: "${MINIO_ACCESS_KEY}", \
    MINIO_SECRET_KEY: "${MINIO_SECRET_KEY}" \
};' > /usr/share/nginx/html/env-config.js.template
```

## 3. No arquivo src/lib/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js';

// Tentar obter do window.env primeiro
const env = (window as any).env || {};
const supabaseUrl = env.supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = env.supabaseKey || import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Env values:', {
    windowEnv: (window as any).env,
    supabaseUrl,
    supabaseKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 4. No arquivo index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="text/javascript" src="/env-config.js"></script>
    <title>ConexIA</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## 5. Configuração do Servidor de Upload (Porta 3500)

### Desenvolvimento Local
```bash
# Rodar o servidor de upload localmente
node server.js  # Roda na porta 3500
```

### Produção
O servidor de upload precisa ser configurado como um serviço separado no Docker:

1. Criar Dockerfile.upload:
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
COPY server.js ./

RUN npm install

EXPOSE 3500
CMD ["node", "server.js"]
```

2. Adicionar ao docker-compose.yml:
```yaml
services:
  upload-server:
    build:
      context: .
      dockerfile: Dockerfile.upload
    environment:
      - MINIO_ENDPOINT=${VITE_MINIO_ENDPOINT}
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
    ports:
      - "3500:3500"
```

3. No frontend, configurar a URL do servidor de upload:
```typescript
// Em produção, usar a URL completa em vez de localhost
const UPLOAD_SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://seu-dominio.com/upload'  // URL de produção
  : 'http://localhost:3500';          // URL local
```

### Observações Importantes
1. O servidor na porta 3500 é essencial para gerar URLs pré-assinadas para upload no MinIO
2. Em produção, configurar um domínio/subdomínio específico para o servidor de upload
3. Garantir que as credenciais do MinIO estejam corretamente configuradas em ambos ambientes
4. Usar HTTPS em produção para segurança
5. Configurar CORS apropriadamente para permitir apenas origens confiáveis

## Dicas Importantes para Debug

### 1. Consistência de Nomes
- Manter os mesmos nomes de variáveis em todos os lugares
- No Portainer: `VITE_SUPABASE_KEY`
- No window.env: `supabaseKey`

### 2. Ordem dos Scripts
- env-config.js deve ser carregado antes do bundle principal
- Usar `type="text/javascript"` na tag script

### 3. Verificação de Erros
- Se houver erro de variáveis undefined, verificar o console do navegador
- O console mostrará os valores de window.env
- Verificar se as variáveis estão chegando corretamente do Portainer

### 4. Build e Deploy
- Após alterações, reconstruir a imagem: `docker build -t dockerconexia/agentesv2:v2.5 .`
- Fazer push da nova imagem: `docker push dockerconexia/agentesv2:v2.5`
- Atualizar o serviço no Portainer com a nova imagem

### 5. Troubleshooting
- Se as variáveis não aparecerem, verificar se o env-config.js está sendo gerado corretamente
- Verificar se o envsubst está substituindo as variáveis no entrypoint
- Confirmar se todas as variáveis de ambiente estão definidas no Portainer

## Observações Importantes
1. Nunca commitar valores reais das variáveis de ambiente no repositório
2. Manter este documento atualizado quando houver mudanças na configuração
3. Em caso de dúvidas, consultar os logs do container no Portainer
