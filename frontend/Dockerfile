FROM node:16-alpine
WORKDIR /app
COPY package.json ./
RUN npm install -g react-scripts
COPY . .
# RUN npm run build
EXPOSE 3000
CMD [ "sh", "-c","npm install && npm start" ]
