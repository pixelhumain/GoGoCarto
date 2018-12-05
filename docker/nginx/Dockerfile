FROM nginx:alpine

RUN rm -rf /var/cache/apk/* && \
    rm -rf /tmp/*
	
RUN apk update && apk add bash rsync

# Install HTTPS requirements
RUN \
    apk add --no-cache --virtual .build-deps \
        openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -subj '/CN=localhost' -days 365 -x509 -newkey rsa:4096 -nodes \
        -keyout /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.crt && \
    apk del .build-deps

WORKDIR /var/www/html/

COPY conf.d/* /etc/nginx/conf.d/

# Install custom entrypoint
COPY entrypoint.sh /usr/local/bin/docker-custom-entrypoint
RUN chmod 777 /usr/local/bin/docker-custom-entrypoint

CMD ["nginx", "-g", "daemon off;"]

ENTRYPOINT ["docker-custom-entrypoint"]
