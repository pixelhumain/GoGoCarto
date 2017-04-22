#!/bash/bin
php bin/console cache:clear
sudo setfacl -R -m u:"www-data":rwX -m u:`whoami`:rwX var/cache var/logs