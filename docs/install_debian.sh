#alias ssh_colibris="ssh -p 22102 -o useroaming=no -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519 admin@carto-dev.colibris-outilslibres.org"

#!/bin/bash
WEB_DIR=/var/www/html
WEB_USR=www-data
DB_USR=cartopen
DB_PWD=biopen40

echo "deb http://ftp.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/backports.list
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

apt update -y ;
apt dist-upgrade -y ;
apt install -y \
sudo \
curl \
build-essential \
git \
php5-fpm \
php5 \
php5-curl \
php5-mysql \
mariadb-server \
git-core \
curl \
openssl \
libsasl2-dev \
libssl-dev;

apt-get install -y nginx  #-t jessie-backports

if [ ! -d "$WEB_DIR" ]; then
  mkdir -p $WEB_DIR
fi
chown -R $WEB_USR $WEB_DIR
cd  $WEB_DIR


#COMPOSER
cd /usr/src
sudo apt-get install -y curl php5-cli
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

# MONGODB
sudo apt-get install -y make php5-dev php-pear

mkdir -p /usr/local/openssl/include/openssl/
ln -s /usr/include/openssl/evp.h /usr/local/openssl/include/openssl/evp.h
mkdir -p /usr/local/openssl/lib/
ln -s /usr/lib/x86_64-linux-gnu/libssl.a /usr/local/openssl/lib/libssl.a
ln -s /usr/lib/x86_64-linux-gnu/libssl.so /usr/local/openssl/lib/
pecl install mongodb
pecl install mongo


sudo apt-get install -y mongodb-org

if grep "extension=mongodb.so" /etc/php5/cli/php.ini 
then
    echo "extenstion deja configuree";
else
    echo "extension=mongodb.so" >> /etc/php5/cli/php.ini
    echo "extension=mongo.so" >> /etc/php5/cli/php.ini
    echo "extension=mongodb.so" >> /etc/php5/fpm/php.ini
    echo "extension=mongo.so" >> /etc/php5/fpm/php.ini
fi

# CREATE DATABASE
echo "Creating Database, connect with mysql root user";
mysql -u root -p -e "CREATE DATABASE $DB_USR ;
CREATE USER "$DB_USR"@"localhost" ;
SET password FOR "$DB_USR"@"localhost" = password('$DB_PWD') ;
GRANT ALL ON $DB_USR.* TO "$DB_USR"@"localhost" ;"


# NODEJS
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
curl -L https://npmjs.org/install.sh | sudo s
h
# PULL CODE
cd $WEB_DIR
git clone -b master https://github.com/Biopenlandes/CartoV3.git
cd CartoV3/

chmod 777 /var/log/mongodb/mongod.log
chmod 777 /var/lib/mongodb
chmod 777 /var/log/mongodb
chmod 777 /var/www/html/CartoV3/var

sudo setfacl -R -m u:"www-data":rwX -m u:`whoami`:rwX var/cache var/logs


apt-get clean

npm install gulp
npm install -g gulp
npm install

sudo -u $WEB_USR composer install ;

echo "
server {
    listen 80;

    root /var/www/html/CartoV3/web;

    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;

    # strip app.php/ prefix if it is present
    rewrite ^/app\.php/?(.*)$ /$1 permanent;

    location / {
        index app.php;
        try_files $uri @rewriteapp;
    }

    location @rewriteapp {
        rewrite ^(.*)$ /app.php/$1 last;
    }

    # pass the PHP scripts to FastCGI server from upstream phpfcgi
    location ~ ^/(app|app_dev|config)\.php(/|$) {
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param  HTTPS off;
    }
}
" > /etc/nginx/sites-available/default

echo "
parameters:
    database_host: 127.0.0.1
    database_port: null
    database_name: $DB_USR
    database_user: $DB_USR
    database_password: $DB_PWD
    mailer_transport: smtp
    mailer_host: 127.0.0.1
    mailer_user: null
    mailer_password: null
    secret: lijd676jf5657fe56Hyjlkdz
    router.request_context.host: mywebsite.fr 
" > app/config/parameters.yml

php bin/console assets:install --symlink web ;

gulp build ;
#gulp production ;

php bin/console doctrine:mongodb:schema:create ;
php bin/console doctrine:mongodb:generate:hydrators ;
php bin/console doctrine:mongodb:generate:proxies ;
php bin/console doctrine:mongodb:fixtures:load ;

php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load

php bin/console cache:clear --env=prod;

chmod -R 777 var/;

# adding crontab task
line="5 3 * * * php /var/www/html/CartoV3/bin/console --env=prod app:elements:checkvote"
line2="@hourly php /var/www/html/CartoV3/bin/console --env=prod app:users:sendNewsletter"
# TODO add crontab automatically
# (crontab -l; echo "$line" ) | crontab -u userhere -

# services au démarrage
systemctl enable mongod
systemctl start mongod

