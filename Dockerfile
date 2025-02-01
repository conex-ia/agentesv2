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

# Instalar envsubst e node/npm para o servidor de presigned URLs
RUN apk add --no-cache gettext nodejs npm

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
    location /api/presign { \
        proxy_pass http://localhost:3500; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados e servidor
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/server.js /app/
COPY --from=builder /app/package*.json /app/

# Instalar dependências do servidor
WORKDIR /app
RUN npm install --production

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

# Script de inicialização
RUN printf '#!/bin/sh\n\
# Substituir variáveis no template\n\
envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js 2>/dev/null\n\
\n\
# Iniciar o servidor de presigned URLs em background\n\
cd /app && node server.js &\n\
\n\
# Remover diretiva user do nginx.conf\n\
sed -i "/user/d" /etc/nginx/nginx.conf 2>/dev/null || true\n\
\n\
# Iniciar nginx\n\
exec nginx -g "daemon off;"\n' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Ajustar permissões
RUN chown -R appuser:appuser /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    chown -R appuser:appuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid && \
    chown -R appuser:appuser /app && \
    chown appuser:appuser /docker-entrypoint.sh

USER appuser

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
