# NAMA FILE: Dockerfile

FROM node:14

WORKDIR /usr/src/app/dumbplay_backend
COPY . .

ENV DB_USER jouzie
ENV DB_PASSWORD jouzie
ENV DB_NAME wayshub
ENV DB_HOST serverdatabase.jouzie.onlinecamp.id

RUN npm i
RUN npm install -g sequelize-cli
RUN sed -i "3s/root/$DB_USER/" config/config.json
RUN sed -i "4s/root/$DB_PASSWORD/" config/config.json
RUN sed -i "5s/wayshub/$DB_NAME/" config/config.json
RUN sed -i "6s/127.0.0.1/$DB_HOST/" config/config.json
RUN sequelize db:migrate

EXPOSE 5000
CMD ["npm","start"]
