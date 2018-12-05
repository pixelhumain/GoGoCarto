#!/bin/bash

mkdir -p /var/www/html/web && chown -R nginx /var/www/html
watch -n 2 -d 'rsync -avu /var/www/app/web/ /var/www/html/web/' > /dev/null &

exec "$@"
