FROM node:14
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm install nodemon
EXPOSE 5000
CMD ["npm","start"]
