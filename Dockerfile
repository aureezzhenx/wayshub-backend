FROM node:14
WORKDIR /usr/src/app
COPY . .
EXPOSE 5000
RUN npm install
RUN npm install nodemon --save-dev
CMD ["npm","start"]
