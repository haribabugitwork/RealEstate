#!/usr/bin/env sh
set -e

# List of microservices
SERVICES="auth property allocation payments complaints company gateway"

for svc in $SERVICES; do
  echo "Bootstrapping services/$svc …"
  cd services/"$svc"

  # Remove any old manifests
  rm -f package.json package-lock.json

  # Determine package name & deps
  case "$svc" in
    auth)
      PKG_NAME="auth-service"
      DEPS='"express": "^4.18.2", "mongoose": "^6.8.0", "dotenv": "^16.0.0", "jsonwebtoken": "^9.0.0", "bcrypt": "^5.1.0", "nodemailer": "^6.9.0"'
      ;;
    property)
      PKG_NAME="property-service"
      DEPS='"express": "^4.18.2", "mongoose": "^6.8.0", "dotenv": "^16.0.0", "jsonwebtoken": "^9.0.0"'
      ;;
    allocation)
      PKG_NAME="allocation-service"
      DEPS='"express": "^4.18.2", "mongoose": "^6.8.0", "dotenv": "^16.0.0", "jsonwebtoken": "^9.0.0", "nodemailer": "^6.9.0"'
      ;;
    payments)
      PKG_NAME="payments-service"
      DEPS='"express": "^4.18.2", "mongoose": "^6.8.0", "dotenv": "^16.0.0", "jsonwebtoken": "^9.0.0"'
      ;;
    complaints)
      PKG_NAME="complaints-service"
      DEPS='"express": "^4.18.2", "mongoose": "^6.8.0", "dotenv": "^16.0.0", "jsonwebtoken": "^9.0.0"'
      ;;
    company)
      PKG_NAME="company-service"
      DEPS='"express": "^4.18.2", "mongoose": "^6.8.0", "dotenv": "^16.0.0", "jsonwebtoken": "^9.0.0"'
      ;;
    gateway)
      PKG_NAME="api-gateway"
      DEPS='"express": "^4.18.2", "cors": "^2.8.5", "dotenv": "^16.0.0", "express-rate-limit": "^6.7.0", "http-proxy-middleware": "^2.0.6", "jsonwebtoken": "^9.0.0"'
      ;;
  esac

  # Write package.json
  cat > package.json <<EOF
{
  "name": "${PKG_NAME}",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    ${DEPS}
  }
}
EOF

  # Install deps
  npm install

  cd - >/dev/null
done

echo "All services bootstrapped. You can now run: docker compose up --build -d"

