# Stage 1: Build
FROM node:20-alpine as builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build do projeto
RUN npm run build

# Stage 2: Produção
FROM nginx:alpine

# Adicionar usuário não-root
RUN adduser -D -u 1000 appuser

# Instalar envsubst
RUN apk add --no-cache gettext

# Configuração do nginx otimizada para SPA
RUN echo 'server { \
    listen 80; \
    access_log off; \
    error_log /dev/stderr; \
    root /usr/share/nginx/html; \
    index index.html; \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    gzip_comp_level 6; \
    gzip_min_length 1000; \
    location / { \
        try_files $uri $uri/ /index.html; \
        add_header Cache-Control "no-cache"; \
        add_header X-Frame-Options "SAMEORIGIN"; \
        add_header X-Content-Type-Options "nosniff"; \
        add_header X-XSS-Protection "1; mode=block"; \
    } \
    location /assets { \
        expires 1y; \
        add_header Cache-Control "public"; \
        access_log off; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

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
    BACKEND_URL: "${VITE_BACKEND_URL}" \
};' > /usr/share/nginx/html/env-config.js.template

# Script de inicialização
RUN printf '#!/bin/sh\n\
# Substituir variáveis no template\n\
envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js\n\
\n\
echo "Configuração de ambiente gerada:"\n\
cat /usr/share/nginx/html/env-config.js\n\
\n\
# Verificar variáveis obrigatórias\n\
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_KEY" ] || [ -z "$VITE_MINIO_ENDPOINT" ] || [ -z "$VITE_BACKEND_URL" ]; then\n\
  echo "Erro: Variáveis de ambiente obrigatórias não definidas"\n\
  exit 1\n\
fi\n\
\n\
nginx -g "daemon off;"\n' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Ajustar permissões
RUN chown -R appuser:appuser /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    chown -R appuser:appuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid && \
    chown appuser:appuser /docker-entrypoint.sh

USER appuser

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
