FROM node:16-alpine
WORKDIR /app
COPY package.json ./
RUN npm ci
RUN npm install -g react-scripts
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
