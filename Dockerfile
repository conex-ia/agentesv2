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

# Configurar variáveis de ambiente para o build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY
ARG VITE_MINIATURA
ARG VITE_URLINFO
ARG VITE_TITULO
ARG VITE_FAVICON
ARG VITE_DESCRICAO

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_KEY=${VITE_SUPABASE_KEY}
ENV VITE_MINIATURA=${VITE_MINIATURA}
ENV VITE_URLINFO=${VITE_URLINFO}
ENV VITE_TITULO=${VITE_TITULO}
ENV VITE_FAVICON=${VITE_FAVICON}
ENV VITE_DESCRICAO=${VITE_DESCRICAO}

# Build do projeto
RUN npm run build

# Stage 2: Produção
FROM nginx:alpine

# Adicionar usuário não-root
RUN adduser -D -u 1000 appuser

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

# Ajustar permissões
RUN chown -R appuser:appuser /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    chown -R appuser:appuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

USER appuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
