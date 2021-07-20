FROM node:14.15-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["start"]
