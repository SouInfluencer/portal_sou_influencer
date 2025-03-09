# Etapa 1: Construção do aplicativo Angular
FROM node:22 AS build

# Diretório de trabalho
WORKDIR /app

# Copiar o package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código fonte
COPY . .

# Gerar os arquivos de build do Angular
RUN npm run build

# Etapa 2: Servir o aplicativo com um servidor Nginx
FROM nginx:alpine

# Definir a variável de ambiente para a porta do Cloud Run
ENV PORT 5143

# Copiar os arquivos de build do Angular para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar a configuração do Nginx personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Expor a porta 4200 para o Cloud Run
EXPOSE 5143

# Iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
