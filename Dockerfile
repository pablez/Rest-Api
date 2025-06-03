# Dockerfile

# Etapa 1: Construcción (para instalar dependencias)
# Usa una imagen base de Node.js
FROM node:20-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Etapa 2: Producción (para ejecutar la aplicación final)
# Usa una imagen más ligera de Node.js para el entorno de producción
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias instaladas de la etapa de construcción
COPY --from=build /app/node_modules ./node_modules

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que la aplicación Express escuchará
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor se inicie
CMD ["node", "src/app.js"]