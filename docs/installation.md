Installation and Production Instructions
========================================

Feel free to add some more informations if you solve installation issues !

Requirements
------------

1. Php
2. [Composer](https://getcomposer.org/download/) 
3. [Nodejs](https://nodejs.org/en/download/)
4. [Git](https://git-scm.com/)
5. Php Server (Apache, [Wamp server](http://www.wampserver.com/) for example)
6. MongoDB (http://php.net/manual/fr/mongodb.installation.php)
7. Any Text Editor (SublimeText for example)

Installation
------------

### Cloning repo (clone dev branch)
```
cd path-to-php-server-folder (default linux /var/www/html, windows c:/wamp/www... )
git clone -b dev https://github.com/Biopenlandes/CartoV3.git
cd CartoV3/
```

### Installing dependencies 
Php dependency (symfony, bundles...) 
```
php path-to/composer.phar install or composer install
```
*During installation, config/parameters file will be created, leave default fields*

Workflow dependencies (compiling sass and javascript)
```
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

Go to symfony console : http://localhost/PagesVertes/web/app_dev.php/_console
```
doctrine:mongodb:schema:create
doctrine:mongodb:generate:hydrators
doctrine:mongodb:generate:proxies
doctrine:mongodb:fixtures:load
```

Then generate if necessary random point on the map :
http://localhost/cartoV3/PagesVertes/web/app_dev.php/acteurs/generate/500

Everthing is ready, enjoy :
http://localhost/PagesVertes/web/app_dev.php

Production
----------

1. Generate compressed js and css files
```gulp production```

2. Move files to distant Server (FTP or other)

3. In the distant console (http://yoursite.com/web/app_dev.php/_console)
```
cache:clear --env=prod
assetic:dump --env=prod
```
