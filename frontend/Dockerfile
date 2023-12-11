FROM node:16-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force
COPY . .
# RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]
