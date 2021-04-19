FROM node:14
WORKDIR /usr/src/appbackend
COPY . .
EXPOSE 5000
CMD ["npm","start"]
