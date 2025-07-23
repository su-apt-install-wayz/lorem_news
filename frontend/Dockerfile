# Utilisation de l'image officielle Node.js
FROM node:22-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier tout le code source
COPY . .

# Exposer le port utilisé par Next
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]