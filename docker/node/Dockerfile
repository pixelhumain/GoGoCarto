FROM node:alpine
LABEL maintainer="Mathieu Girard <mgirard.dev@gmail.com>"

RUN apk update && apk add --no-cache git shadow

RUN npm install -g gulp node-sass postcss-cli autoprefixer watch --unsafe-perm

COPY package.json /var/www/html/

WORKDIR /var/www/html/

RUN chown -R node:node /var/www/html/

RUN \
	npm update && \
	npm install gulp && \
	npm install

