FROM node:20-alpine

WORKDIR /app

# COPY package files
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

# COPY src code
COPY src ./src

# build typescript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]