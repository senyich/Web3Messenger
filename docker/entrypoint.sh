#!/bin/sh
set -e

until pg_isready -h database -U ${POSTGRES_USER:-app} -d ${POSTGRES_DB:-app}; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

php bin/console doctrine:migrations:migrate --no-interaction

exec docker-php-entrypoint "$@"