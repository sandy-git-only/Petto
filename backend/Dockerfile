FROM node:16-alpine
WORKDIR /app
COPY . .
RUN ls -al /app
RUN npm install && npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime", "app.js"]
