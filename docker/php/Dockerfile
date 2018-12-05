FROM php:7.1-fpm-alpine as symfony_php
LABEL maintainer="Alexandre Jardin <info@ajardin.fr>"

RUN rm -rf /var/cache/apk/* && \
    rm -rf /tmp/*

RUN apk update

RUN apk add bash

# Install Symfony requirements
RUN \
    apk add --no-cache --virtual .persistent-deps \
        autoconf \
		freetype-dev \
		gcc \
        git \
        icu-libs \
		libc-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        postgresql-libs \
        rsync \
        ssmtp \
        yarn \
        zlib-dev && \
    apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        icu-dev \
        postgresql-dev && \
    docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && \
    docker-php-ext-install \
		bcmath \
        intl \
        gd \
        opcache \
        pdo_pgsql \
        zip && \
	yes "" | pecl install lzf mongodb && \
	docker-php-ext-enable lzf mongodb && \
    perl -pi -e "s/mailhub=mail/mailhub=maildev/" /etc/ssmtp/ssmtp.conf && \
    apk del .build-deps

# RUN \
#	pecl update-channels && \
#	yes "" | pecl install mongodb && \
#	docker-php-ext-enable mongodb

# Install Composer globally
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_MEMORY_LIMIT -1

RUN \
    curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && \
    composer self-update --preview
	
# Install custom entrypoint
COPY entrypoint.sh /usr/local/bin/docker-custom-entrypoint
RUN chmod 777 /usr/local/bin/docker-custom-entrypoint
CMD ["php-fpm"]
ENTRYPOINT ["docker-custom-entrypoint"]

# ======================================================================================================================
FROM symfony_php as symfony_php_blackfire
RUN \
    curl -sS https://packages.blackfire.io/binaries/blackfire-php/1.23.1/blackfire-php-alpine_amd64-php-72.so \
        --output $(php -r "echo ini_get('extension_dir');")/blackfire.so && \
    docker-php-ext-enable blackfire
# ======================================================================================================================

# ======================================================================================================================
FROM symfony_php as symfony_php_xdebug
RUN \
    apk add --no-cache --virtual .build-deps $PHPIZE_DEPS && \
    yes "" | pecl install xdebug && \
    docker-php-ext-enable xdebug
# ======================================================================================================================
