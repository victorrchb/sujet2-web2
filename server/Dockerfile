FROM node:18

WORKDIR /app

COPY package*.json ./

# Ajout des dépendances nécessaires pour bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Installation des dépendances
RUN npm install
# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 5000

CMD ["npm", "start"]