#!/bash/bin
php bin/console cache:clear
php bin/console cache:clear --env=prod
sudo setfacl -R -m u:"www-data":rwX -m u:`whoami`:rwX var/cache var/logs