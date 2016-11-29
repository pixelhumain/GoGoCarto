MonVoisinFaitDuBio
==================

Be pleased to add some more informations if you solve installation issues !

Requirements
------------

1. Php
2. [Composer](https://getcomposer.org/download/) 
3. [Nodejs](https://nodejs.org/en/download/)
4. [Git](https://git-scm.com/)
5. [Wamp server](http://www.wampserver.com/)

Installation helper (in french) :

1. [Openclassroom "Vérifier l'installation de PHP en console"](https://openclassrooms.com/courses/developpez-votre-site-web-avec-le-framework-symfony2/symfony2-un-framework-php)
2. [Openclassroom "Installer composer et git"](https://openclassrooms.com/courses/developpez-votre-site-web-avec-le-framework-symfony2/installer-un-bundle-grace-a-composer)


Installation
------------

### Cloning repo
```
cd path-to-wamp-www (default windows c:/wamp/www)
git clone https://github.com/Biopenlandes/PagesVertes.git
cd PagesVertes/
```

### Installing dependencies 
Php dependency (symfony, bundles...) 
```
php path-to/composer.phar install or composer install
```
*During installation, config/parameters file will be created, provide database infos or leave default fields*

Workflow dependencies (gulp for compiling sass and javascript)
```
npm install
```

Start
-----
Dumping assets
```
php app/console assets:install --symlink web
```
Start gulp
```
gulp watch
```
Lauch wamp server

Generate Database
-----------------

Go to symfony console : http://localhost/PagesVertes/web/app_dev.php/_console
```
doctrine:schema:update --force
doctrine:fixtures:load
```

Then generate if necessary random point on the map :
http://localhost/cartoV3/PagesVertes/web/app_dev.php/fournisseur/generate/500

Everthing is ready, enjoy :
http://localhost/PagesVertes/web/app_dev.php

Production
----------

1. gulp production
2. move files to FTP
