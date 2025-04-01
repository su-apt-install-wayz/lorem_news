#!/bin/bash
set -e

# Vérifier si le projet a déjà été initialisé
if [ ! -f "/var/www/html/.init_done" ]; then
    echo "Initialisation du projet Shopy..."

    # Naviguer dans le répertoire du projet si nécessaire
    cd /var/www/html

    # Installer les dépendances PHP via Composer
    echo "Installation des dépendances Composer..."
    composer install --no-interaction

    # Attendre que la base de données soit prête (utile si votre DB prend du temps à démarrer)
    echo "Attente de la base de données..."
    while ! /usr/bin/mysqladmin ping -h"shopy-db-1" --silent; do
        sleep 1
    done

    # Installer les tables MySql via Doctrine
    echo "Installation des tables MySql..."
    php bin/console doctrine:migrations:migrate --no-interaction

    # Charger les fixtures
    echo "Chargement des fixtures..."
    php bin/console doctrine:fixtures:load --no-interaction

    # Marquer le projet comme initialisé pour éviter de répéter ces opérations
    touch /var/www/html/.init_done

    echo "Le projet shopy a été initialisé avec succès."
else
    echo "Le projet shopy a déjà été initialisé."
    echo "Lancement des tâches post-démarrage..."

    # Exécuter les migrations
    echo "Lancement des migrations Doctrine..."
    php bin/console doctrine:migrations:migrate --no-interaction

    # Vider le cache Symfony
    echo "Nettoyage du cache Symfony..."
    php bin/console cache:clear

    # Réchauffer le cache Symfony
    echo "Réchauffement du cache Symfony..."
    php bin/console cache:warmup

    echo "Tâches Symfony post-démarrage terminées."
fi

# Redémarrer Apache pour appliquer les changements
apache2ctl -D FOREGROUND