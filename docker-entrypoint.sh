#!/bin/sh
set -e

PORT_TO_USE="${PORT:-8080}"

sed -i "s/listen 8080;/listen ${PORT_TO_USE};/g" /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"