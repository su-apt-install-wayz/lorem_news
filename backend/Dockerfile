FROM php:8.4-fpm

# Sys deps nécessaires (intl, gd, zip, soap, pgsql)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libicu-dev pkg-config \
    libxml2-dev \
    zlib1g-dev libzip-dev \
    libpng-dev libjpeg62-turbo-dev libwebp-dev libfreetype6-dev \
    libpq-dev postgresql-client wget vim git zip unzip nano tzdata locales nodejs npm cron \
    tesseract-ocr tesseract-ocr-fra dos2unix poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Config/compile des extensions
RUN docker-php-ext-configure gd --with-jpeg --with-freetype --with-webp \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j"$(nproc)" pdo pdo_pgsql gd zip pcntl exif soap intl

RUN pecl install apcu && \
    pecl install xdebug && \
    docker-php-ext-enable opcache apcu

RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/99-opcache.ini && \
    echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/99-opcache.ini && \
    echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/99-opcache.ini && \
    echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/99-opcache.ini && \
    echo "opcache.revalidate_freq=60" >> /usr/local/etc/php/conf.d/99-opcache.ini && \
    echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/99-opcache.ini

RUN echo "apc.enabled=1" >> /usr/local/etc/php/conf.d/99-apcu.ini && \
    echo "apc.shm_size=64M" >> /usr/local/etc/php/conf.d/99-apcu.ini && \
    echo "apc.ttl=7200" >> /usr/local/etc/php/conf.d/99-apcu.ini && \
    echo "apc.user_ttl=7200" >> /usr/local/etc/php/conf.d/99-apcu.ini && \
    echo "apc.gc_ttl=3600" >> /usr/local/etc/php/conf.d/99-apcu.ini && \
    echo "apc.enable_cli=1" >> /usr/local/etc/php/conf.d/99-apcu.ini

RUN echo "zend_extension=xdebug.so" >> /usr/local/etc/php/conf.d/99-xdebug.ini && \
    echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/99-xdebug.ini && \
    echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/99-xdebug.ini && \
    echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/99-xdebug.ini && \
    echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/99-xdebug.ini && \
    echo "xdebug.log_level=0" >> /usr/local/etc/php/conf.d/99-xdebug.ini && \
    echo "xdebug.log=/tmp/xdebug.log" >> /usr/local/etc/php/conf.d/99-xdebug.ini

RUN echo "Europe/Paris" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata && \
    echo "fr_FR.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=fr_FR.UTF-8

ENV TZ=Europe/Paris
ENV LANG=fr_FR.UTF-8
ENV LANGUAGE=fr_FR:fr
ENV LC_ALL=fr_FR.UTF-8

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    php -r "unlink('composer-setup.php');" \
    composer require --dev symfony/test-pack symfony/browser-kit symfony/http-client

WORKDIR /var/www/html

COPY --chown=www-data:www-data ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN dos2unix /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY . .

EXPOSE 9000
