Installation and Production Instructions
========================================

*Last update : 2018/06/04*

Feel free to add some more informations if you solve installation issues !

**There is a script for debian installation** named install_debian.sh in this docs directory ! The script is more appropriate for production server installation, but having a look to the script can probably help you for some steps.

Requirements
------------

1. Php
2. [Composer](https://getcomposer.org/download/) 
3. [Nodejs](https://nodejs.org/en/download/)
4. [Git](https://git-scm.com/)
5. Web Server (Apache, Ngninx, [Wamp server](http://www.wampserver.com/) ...)
6. MongoDB (http://php.net/manual/fr/mongodb.installation.php)

The project is using php5. **If you want to use php7**, you will need to install the [MongoPhpAdapter](https://github.com/alcaeus/mongo-php-adapter)
To do so, please run :
```
composer config "platform.ext-mongo" "1.6.16" && composer require alcaeus/mongo-php-adapter
```

Installation
------------

### Cloning repo (clone dev branch)
```
cd path-to-php-server-folder (default linux /var/www/html, windows c:/wamp/www... )
git clone https://github.com/pixelhumain/GoGoCarto
cd GoGoCarto/
```

### Installing dependencies 
Php dependency (symfony, bundles...) 
```
php path-to/composer.phar install or composer install
```
*During installation, config/parameters file will be created, leave default fields*

Workflow dependencies (compiling sass and javascript)
```
npm install gulp
npm install -g gulp
npm install
```

Start
-----
Dumping assets
```
php bin/console assets:install --symlink web
```

First build of Javascript and Css
```
gulp build
```

Start watching for file change (automatic recompile)
```
gulp watch
```


Generate Database
-----------------

Go to symfony console : http://localhost/GoGoCarto/web/app_dev.php/_console
Run the followings command
```
doctrine:mongodb:schema:create
doctrine:mongodb:generate:hydrators
doctrine:mongodb:generate:proxies
doctrine:mongodb:fixtures:load
```

The last command will generate a basic configuration, and two default users : "admin/admin" and "user/user"

Then generate if necessary random point on the map :
app:elements:generate 200

Everthing is ready, enjoy :
http://localhost/GoGoCarto/web/app_dev.php

Production
----------

1. Dump assetic in symfony console to update the web/templates files
```assetic:dump```

2. Generate compressed js and css files
```
gulp build
gulp production
```

3. enable gz compression in your web server

4. In the distant console (http://yoursite.com/web/app_dev.php/_console)
```
cache:clear --env=prod
```

5. Make sure that the var folder is writable ```chmod -R 771 var/```