FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5005
CMD ["node", "--dns-result-order=ipv4first", "server.js"]
