#!/bin/bash

# Exécuter composer install si le dossier vendor n'existe pas
if [ ! -d "vendor" ]; then
    composer install --no-interaction --optimize-autoloader
    php bin/console doctrine:migrations:migrate --no-interaction
fi

# Exécuter génération clés JWT si répertoire n'existe pas
if [ ! -d "config/jwt" ]; then
    php bin/console lexik:jwt:generate-keypair
fi

# Lancer PHP-FPM
php-fpm