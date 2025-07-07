# Use official Node.js image
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev @types/express @types/cors

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"] 