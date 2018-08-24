#!/bin/bash

# launch as root or as sudoer user with sudo before de script

# TODO : had to manually create .npm, .config and .composer in the user home with good permissions
#sudo chown -R $USER:$(id -gn $USER) /var/www/.config

# settings you will have to adapt to your environment
WEB_DIR=/var/www/gogocarto
WEB_USR=www-data
WEB_GRP=www-data
WEB_URL=gogocarto.fr

apt update -y ;
apt dist-upgrade -y ;
apt install -y \
sudo \
curl \
build-essential \
git \
php7.0-fpm \
php7.0 \
php7.0-cli \
php7.0-curl \
php7.0-dev \
php7.0-bcmath \
php7.0-mongodb \
php7.0-mbstring \
nginx \
git-core \
mongodb \
openssl \
libsasl2-dev \
libssl-dev;
apt-get autoclean -y;

#COMPOSER
cd /usr/src
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

# NODEJS
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
curl -L https://npmjs.org/install.sh | sudo sh

# PULL CODE
if [ ! -d "$WEB_DIR" ]; then
  mkdir -p $WEB_DIR
fi
chown -R $WEB_USR:$WEB_GRP $WEB_DIR
sudo -u $WEB_USR git clone -b production https://github.com/pixelhumain/GoGoCarto.git $WEB_DIR
cd $WEB_DIR

# permissions
#chmod 777 /var/log/mongodb/mongod.log
#chmod 777 /var/lib/mongodb
#chmod 777 /var/log/mongodb
#setfacl -R -m -m u:`whoami`:rwX var/cache var/logs
chmod 777 $WEB_DIR/var

# npm stuff
npm install gulp -g
sudo -u $WEB_USR npm install

# php deps and symphony stuff
sudo -u $WEB_USR echo "parameters:
  mailer_transport: smtp
  mailer_host: 127.0.0.1
  mailer_user: null
  mailer_password: null
  secret: lijd676jf5657fe56Hyjlkdz
  router.request_context.host: ${WEB_URL}
  csrf_protection: true
  oauth_communs_id: communsIds
  oauth_communs_secret: communsSecret
  oauth_google_id: googleId
  oauth_google_secret: googleSecret
  oauth_facebook_id: facebookId
  oauth_facebook_secret: facebookSecret
" > app/config/parameters.yml
chown -R $WEB_USR:$WEB_GRP $WEB_DIR/app/config/parameters.yml
sudo -u $WEB_USR composer config "platform.ext-mongo" "1.6.16" && sudo -u $WEB_USR composer require alcaeus/mongo-php-adapter
sudo -u $WEB_USR composer install;

sudo -u $WEB_USR php bin/console assets:install --symlink web ;

sudo -u $WEB_USR gulp build ;
sudo -u $WEB_USR gulp production ;

sudo -u $WEB_USR php $WEB_DIR/bin/console doctrine:mongodb:schema:create ;
sudo -u $WEB_USR php $WEB_DIR/bin/console doctrine:mongodb:generate:hydrators ;
sudo -u $WEB_USR php $WEB_DIR/bin/console doctrine:mongodb:generate:proxies ;
sudo -u $WEB_USR php $WEB_DIR/bin/console doctrine:mongodb:fixtures:load ;

# nginx config TODO: https, http2, 
echo "
server {
  listen 80;
  server_name *.${WEB_URL};

  root ${WEB_DIR}/web;

  error_log /var/log/nginx/error.log;
  access_log /var/log/nginx/access.log;

  # strip app.php/ prefix if it is present
  rewrite ^/app\.php/?(.*)$ /\$1 permanent;

  location / {
    index app.php;
    try_files \$uri @rewriteapp;
  }

  location @rewriteapp {
    rewrite ^(.*)$ /app.php/\$1 last;
  }

  # pass the PHP scripts to FastCGI server from upstream phpfcgi
  location ~ ^/(app|app_dev|config)\.php(/|$) {
    fastcgi_pass unix:/var/run/php/php7.0-fpm.sock;
    fastcgi_split_path_info ^(.+\.php)(/.*)$;
    include fastcgi_params;
    fastcgi_param  SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
    fastcgi_param  HTTPS off;
  }
}
" > /etc/nginx/sites-available/${WEB_URL}
ln -s /etc/nginx/sites-available/${WEB_URL} /etc/nginx/sites-enabled/${WEB_URL}
nginx -t
service nginx reload

# adding crontab task
#line="@daily php /var/www/html/GoGoCarto/bin/console --env=prod app:elements:checkvote"
#line2="@hourly php /var/www/html/GoGoCarto/bin/console --env=prod app:users:sendNewsletter"
#line3="@daily php /var/www/html/GoGoCarto/bin/console --env=prod app:elements:checkExternalSourceToUpdate"
# TODO : add crontab automatically
# (crontab -l; echo "$line" ) | crontab -u userhere -

# services au démarrage (pas necessaire avec debian 9)
# service mongod enable
# service mongod start
