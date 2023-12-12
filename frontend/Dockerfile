FROM node:16-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm install -g react-scripts react
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
