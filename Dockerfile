FROM node:16-alpine

WORKDIR /calculator

COPY . .

EXPOSE 3000

RUN npm install

CMD ["npm", "start"]