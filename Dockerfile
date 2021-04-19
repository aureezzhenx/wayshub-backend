FROM node:14
WORKDIR /usr/src/app
COPY . .
EXPOSE 5000
CMD ["npm","start"]
