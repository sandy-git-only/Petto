FROM node:16-alpine
WORKDIR /app
COPY . .
# COPY package.json ./
RUN npm install && npm cache clean --force

# RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]
