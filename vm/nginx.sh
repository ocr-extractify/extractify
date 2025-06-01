#!/bin/bash
# Script to set up nginx configuration to serve files from /srv/files

# Ensure the script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root."
  exit 1
fi

# Backup existing nginx.conf if it exists
NGINX_CONF="/etc/nginx/nginx.conf"
if [ -f "$NGINX_CONF" ]; then
  cp "$NGINX_CONF" "${NGINX_CONF}.bak"
  echo "Existing nginx.conf backed up to ${NGINX_CONF}.bak"
fi

# Write new nginx configuration
cat > "$NGINX_CONF" <<'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # TODO: decrease this value in future, 200M is too large (set this accordingly to app requirements)
    client_max_body_size 200M;  

    server {
        listen 80 ;
        listen [::]:80 ;
        server_name 195.200.0.115;

        root /srv;
        index index.html index.htm;


        # Frontend route
        location / {
            alias /srv/frontend/;
            try_files $uri $uri.html $uri/ /index.html;
        }
    }
}
EOF

# Test the new nginx configuration
nginx -t
if [ $? -eq 0 ]; then
    # Reload nginx to apply changes
    systemctl restart nginx
    echo "nginx configuration applied and nginx reloaded successfully."
else
    echo "Error in nginx configuration. Please check the error messages above."
fi