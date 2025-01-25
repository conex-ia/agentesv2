#!/bin/sh

# Substituir variáveis de ambiente no arquivo .env
envsubst < .env > .env.tmp && mv .env.tmp .env

# Fazer o build do projeto
npm run build

# Copiar os arquivos buildados para o diretório do nginx
cp -r dist/* /usr/share/nginx/html/

# Iniciar o nginx
nginx -g 'daemon off;'
