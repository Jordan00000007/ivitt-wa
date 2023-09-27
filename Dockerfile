FROM node:16.14.2 AS builder
WORKDIR /usr/ivitT
COPY . .

RUN npm i && \
  npm run build


FROM nginx:1.23.1 AS production
# COPY --from=builder /usr/ivitT/build /usr/share/nginx/static 
COPY --from=builder /usr/ivitT/build /etc/nginx/html 
# COPY --from=builder /usr/ivitT/release/nginx.conf /etc/nginx/nginx.conf
COPY ./release/default.conf.template /etc/nginx/templates/default.conf.template
