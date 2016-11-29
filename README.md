MonVoisinFaitDuBio
==================

Requirements
------------
(be pleased to add some more informations if you solve installation issues)

Php 
[Composer](https://getcomposer.org/download/) 
[Nodejs](https://nodejs.org/en/download/)
[Git](https://git-scm.com/)
[Wamp server](http://www.wampserver.com/)

Autres liens :
[Openclassroom "Vérifier l'installation de PHP en console"](https://openclassrooms.com/courses/developpez-votre-site-web-avec-le-framework-symfony2/symfony2-un-framework-php)
[Openclassroom "Installer composer et git"](https://openclassrooms.com/courses/developpez-votre-site-web-avec-le-framework-symfony2/installer-un-bundle-grace-a-composer)


Installation
------------

### Cloning repo
```
cd path-to-wamp-www (default windows c:/wamp/www)
git clone https://github.com/Biopenlandes/PagesVertes.git
cd PagesVertes/
```

### Installing dependencies 
php dependency (symfony, bundles...) 
```
php path-to/composer.phar install or composer install
```
during installation config/parameters file will be created, provide database infos
for example :
database_name: pagesvertes
database_user: root

Workflow dependencies (gulp for compiling sass and javascript)
```
npm install
```

Start
-----
dumping assets
```
php app/console assets:install --symlink web
```
start gulp
```
gulp watch
```
lauch wamp server

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

gulp production
move files to FTP
