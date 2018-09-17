#!/bin/bash

# launch as root or as sudoer user with sudo before de script

# /!\ ATTENTION /!\ THE WILDCARD CERTIFICATE MUST BE CREATE BEFORE EXECUTION OF THE SCRIPT
# TODO : automatiser la creation du certif wildcard
# # gestion du certificat wildcard https par certbot
# certbot certonly \
# --server https://acme-v02.api.letsencrypt.org/directory \
# --manual --preferred-challenges dns \
# -d *.${WEB_URL} -d ${WEB_URL}

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
certbot \
curl \
build-essential \
git \
php7.0-fpm \
php7.0 \
php7.0-cli \
php7.0-curl \
php7.0-dev \
php7.0-gd \
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
  use_as_saas: true
  base_url: ${WEB_URL}
  base_path: ''
  mailer_transport: smtp
  mailer_host: 127.0.0.1
  mailer_user: null
  mailer_password: null
  secret: lijd676jf5657fe56Hyjlkdz
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

sudo -u $WEB_USR php bin/console assets:install --symlink web  --no-interaction;

sudo -u $WEB_USR gulp build ;
sudo -u $WEB_USR gulp production ;

sudo -u $WEB_USR php $WEB_DIR/bin/console doctrine:mongodb:schema:create  --no-interaction;
sudo -u $WEB_USR php $WEB_DIR/bin/console doctrine:mongodb:generate:hydrators  --no-interaction;
sudo -u $WEB_USR php $WEB_DIR/bin/console doctrine:mongodb:generate:proxies  --no-interaction;
sudo -u $WEB_USR php $WEB_DIR/bin/console doctrine:mongodb:fixtures:load  --no-interaction;


echo "server {
  listen 80;
  listen [::]:80;
  server_name ${WEB_URL};

  access_log /var/log/nginx/${WEB_URL}.access.log;
  error_log /var/log/nginx/${WEB_URL}.error.log;

  location /.well-known/acme-challenge/ {
    default_type \"text/plain\";
    root /var/www/certbot;
  }

  location / { return 301 https://www.\$host\$request_uri; }
}

server {
  listen 80;
  listen [::]:80;
  server_name *.${WEB_URL};

  access_log /var/log/nginx/${WEB_URL}.access.log;
  error_log /var/log/nginx/${WEB_URL}.error.log;

  location /.well-known/acme-challenge/ {
    default_type \"text/plain\";
    root /var/www/certbot;
  }

  location / { return 301 https://\$host\$request_uri; }
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name *.${WEB_URL};

  root ${WEB_DIR}/web;

  # For example with certbot (you need a certificate to run https)
  ssl_certificate      /etc/letsencrypt/live/${WEB_URL}/fullchain.pem;
  ssl_certificate_key  /etc/letsencrypt/live/${WEB_URL}/privkey.pem;

  # Security hardening (as of 11/02/2018)
  ssl_protocols TLSv1.2; # TLSv1.3, TLSv1.2 if nginx >= 1.13.0
  ssl_prefer_server_ciphers on;
  ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
  # ssl_ecdh_curve secp384r1; # Requires nginx >= 1.1.0, not compatible with import-videos script
  ssl_session_timeout  10m;
  ssl_session_cache shared:SSL:10m;
  ssl_session_tickets off; # Requires nginx >= 1.5.9
  ssl_stapling on; # Requires nginx >= 1.3.7
  ssl_stapling_verify on; # Requires nginx => 1.3.7

  # Configure with your resolvers
  # resolver \$DNS-IP-1 \$DNS-IP-2 valid=300s;
  # resolver_timeout 5s;

  # Enable compression for JS/CSS/HTML bundle, for improved client load times.
  # It might be nice to compress JSON, but leaving that out to protect against potential
  # compression+encryption information leak attacks like BREACH.
  gzip on;
  gzip_types text/css text/html application/javascript;
  gzip_vary on;

  add_header Strict-Transport-Security \"max-age=63072000; includeSubDomains; preload\";

  access_log /var/log/nginx/${WEB_URL}.access.log;
  error_log /var/log/nginx/${WEB_URL}.error.log;

  location ^~ '/.well-known/acme-challenge' {
    default_type \"text/plain\";
    root /var/www/certbot;
  }

    # cache.appcache, your document html and data
    location ~* \.(?:manifest|appcache|html?|xml|json)$ {
    add_header Cache-Control \"max-age=0\";
    }

    # Feed
    location ~* \.(?:rss|atom)$ {
    add_header Cache-Control \"max-age=3600\";
    }

    # Media: images, icons, video, audio, HTC
    location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|mp4|ogg|ogv|webm|htc)$ {
    access_log off;
    add_header Cache-Control \"max-age=2592000\";
    }

    # Media: svgz files are already compressed.
    location ~* \.svgz$ {
    access_log off;
    gzip off;
    add_header Cache-Control \"max-age=2592000\";
    }

    # CSS and Javascript
    location ~* \.(?:css|js)$ {
    add_header Cache-Control \"max-age=31536000\";
    access_log off;
    }

    # WebFonts
  location ~* \.(?:ttf|ttc|otf|eot|woff|woff2)$ {
    add_header Cache-Control \"max-age=2592000\";
    access_log off;
  }

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
}" > /etc/nginx/sites-available/${WEB_URL}
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
