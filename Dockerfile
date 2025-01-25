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
RUN echo 'export const env = { \
    supabaseUrl: "${VITE_SUPABASE_URL}", \
    supabaseKey: "${VITE_SUPABASE_KEY}", \
    MINIATURA: "${VITE_MINIATURA}", \
    URLINFO: "${VITE_URLINFO}", \
    TITULO: "${VITE_TITULO}", \
    FAVICON: "${VITE_FAVICON}", \
    DESCRICAO: "${VITE_DESCRICAO}" \
};' > /usr/share/nginx/html/env-config.js.template

# Script de inicialização
RUN printf '#!/bin/sh\n\
# Substituir variáveis no template\n\
cat > /usr/share/nginx/html/env-config.js << EOF\n\
window.env = {\n\
  supabaseUrl: "${VITE_SUPABASE_URL}",\n\
  supabaseKey: "${VITE_SUPABASE_KEY}",\n\
  MINIATURA: "${VITE_MINIATURA}",\n\
  URLINFO: "${VITE_URLINFO}",\n\
  TITULO: "${VITE_TITULO}",\n\
  FAVICON: "${VITE_FAVICON}",\n\
  DESCRICAO: "${VITE_DESCRICAO}"\n\
};\n\
EOF\n\
\n\
echo "Conteúdo de env-config.js:"\n\
cat /usr/share/nginx/html/env-config.js\n\
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

CMD ["/docker-entrypoint.sh"]
