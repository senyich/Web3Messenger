FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    nginx \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/project

COPY composer.json composer.lock ./

RUN composer install --no-scripts --no-autoloader --no-interaction

COPY . .

RUN composer dump-autoload --optimize && \
    composer run-script post-install-cmd

RUN chown -R www-data:www-data /var/www/project/var

COPY nginx.conf /etc/nginx/sites-available/default

RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

RUN rm -rf /var/lib/apt/lists/* && \
    rm -rf /var/cache/apt/* && \
    rm -rf /tmp/*

EXPOSE 80

CMD bash -c "service nginx start && php-fpm"