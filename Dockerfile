
FROM node:18


WORKDIR /app


COPY package*.json ./


RUN npm install --only=prod  # Install only production dependencies


COPY . .


EXPOSE 5000


CMD ["node", "index.js"]
