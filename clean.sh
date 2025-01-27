#!/bin/bash

# Remover arquivos de teste
rm -f test-image.png test-upload.txt

# Remover arquivos de cache do Vite
rm -f vite.config.ts.timestamp-*.mjs

# Remover outros arquivos temporários se existirem
rm -rf dist
rm -rf .bolt
