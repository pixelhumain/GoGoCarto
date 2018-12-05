#!/bin/bash
set -euo pipefail

if [[ $(php -r "echo (int) extension_loaded('blackfire');") -eq 1 ]]; then
    cat << CONFIG > "${PHP_INI_DIR}"/conf.d/blackfire.ini
blackfire.agent_socket=tcp://blackfire:${BLACKFIRE_PORT}
blackfire.agent_timeout=5
blackfire.log_file=/var/log/blackfire.log
blackfire.log_level=${BLACKFIRE_LOG_LEVEL}
blackfire.server_id=${BLACKFIRE_SERVER_ID}
blackfire.server_token=${BLACKFIRE_SERVER_TOKEN}
CONFIG
fi

# Allow the Symfony application to write inside volumes
mkdir -p /var/www/html/var/ && chown -R www-data /var/www/html/var/

chown -R www-data /var/www/html

if [[ ! -d /var/www/html/vendor ]]; then
    mkdir -p /var/www/html/vendor
    rsync -avu --exclude ".idea" --exclude ".svn" --exclude "docker" /var/www/app/vendor/ /var/www/html/vendor/ > /dev/null
fi

if [[ ! -d /var/www/html/vendor/alcaeus ]]; then
    composer config "platform.ext-mongo" "1.6.16" && composer require alcaeus/mongo-php-adapter
fi

watch -n 5 -d 'rsync -avu --exclude ".idea" --exclude ".svn" --exclude "docker" --exclude "docs"  --exclude "vendor" --exclude "var" /var/www/app/ /var/www/html/' > /dev/null &

exec "$@"
