FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Vite dev server (for development)
CMD ["npm", "run", "dev"]
