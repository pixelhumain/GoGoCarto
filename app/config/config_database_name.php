<?php
// get the database name from the url. For exemple my-project.gogocarto.fr will use the database name "my-project"
$container->setParameter('database_name', explode('.', $_SERVER["HTTP_HOST"])[0]);