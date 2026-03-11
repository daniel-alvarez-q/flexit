#!/bin/sh
set -eu

# Allow runtime override while defaulting to production in containers.
DJANGO_SETTINGS_MODULE="${DJANGO_SETTINGS_MODULE:-FlexIt.settings.production}"
export DJANGO_SETTINGS_MODULE

python manage.py migrate --noinput
exec uvicorn FlexIt.asgi:application --host=0.0.0.0 --port=8000