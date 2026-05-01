FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --registry https://registry.npmmirror.com
COPY src ./src
EXPOSE 3000
ENV PORT=3000
CMD ["node", "src/server.js"]
