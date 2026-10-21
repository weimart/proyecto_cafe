# 🚀 GUÍA DE DESPLIEGUE UNIX/LINUX
## Esencia y Taza - Sitio Web Production-Ready

---

## TABLA DE CONTENIDOS
1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Preparación del Servidor](#preparación-del-servidor)
3. [Instalación de Dependencias](#instalación-de-dependencias)
4. [Clonación del Proyecto](#clonación-del-proyecto)
5. [Configuración de Base de Datos](#configuración-de-base-de-datos)
6. [Configuración de Nginx](#configuración-de-nginx)
7. [Certificado SSL/TLS](#certificado-ssltls)
8. [Despliegue de la Aplicación](#despliegue-de-la-aplicación)
9. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
10. [Respaldo y Recuperación](#respaldo-y-recuperación)

---

## REQUISITOS DEL SISTEMA

### Distribuciones Soportadas
```bash
✓ Ubuntu 22.04 LTS (Recomendado)
✓ Ubuntu 20.04 LTS
✓ Debian 12
✓ Debian 11
✓ AlmaLinux 9
✓ Rocky Linux 9
```

### Requisitos Mínimos de Hardware
```
CPU:    2 vCPU (4 vCPU recomendado)
RAM:    2 GB (4 GB recomendado)
Disco:  20 GB SSD (50 GB mínimo en producción)
```

### Requisitos de Software
```
Node.js:        20.x LTS o superior
PostgreSQL:     14 o superior
Redis:          6.x o superior
Nginx:          1.24 o superior
```

---

## PREPARACIÓN DEL SERVIDOR

### 1. Actualizar Sistema
```bash
# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar utilidades básicas
sudo apt install -y \
    build-essential \
    curl \
    wget \
    git \
    nano \
    htop \
    net-tools \
    unzip \
    ssl-cert

# Instalar herramientas de desarrollo
sudo apt install -y \
    pkg-config \
    python3-dev
```

### 2. Crear Usuario de Aplicación
```bash
# Crear usuario sin shell interactivo
sudo useradd -m -s /usr/sbin/nologin esencia-taza

# Crear directorios necesarios
sudo mkdir -p /var/www/esencia-y-taza
sudo mkdir -p /var/log/esencia-taza
sudo mkdir -p /var/cache/nginx/{assets,api,html}

# Asignar permisos
sudo chown -R esencia-taza:esencia-taza /var/www/esencia-y-taza
sudo chown -R esencia-taza:esencia-taza /var/log/esencia-taza
sudo chown -R www-data:www-data /var/cache/nginx
```

### 3. Configurar Firewall
```bash
# Habilitar UFW
sudo ufw enable

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verificar reglas
sudo ufw status
```

---

## INSTALACIÓN DE DEPENDENCIAS

### 1. Node.js (LTS)
```bash
# Agregar repositorio NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalación
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 2. PostgreSQL
```bash
# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verificar
sudo -u postgres psql --version
```

### 3. Redis
```bash
# Instalar Redis
sudo apt install -y redis-server

# Iniciar servicio
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verificar
redis-cli ping  # Debería responder "PONG"
```

### 4. Nginx
```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar servicio
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar
nginx -v
```

---

## CLONACIÓN DEL PROYECTO

### 1. Clonar Repositorio Git
```bash
# Cambiar a directorio
cd /var/www/esencia-y-taza

# Clonar repositorio
sudo git clone https://github.com/tu-usuario/esencia-y-taza.git .

# Cambiar permisos
sudo chown -R esencia-taza:esencia-taza .
```

### 2. Instalar Dependencias Node
```bash
# Cambiar al usuario de la app
sudo su - esencia-taza -s /bin/bash

# Navegar al directorio
cd /var/www/esencia-y-taza

# Instalar dependencias (sin scripts opcionales)
npm ci --production

# Compilar assets
npm run build

# Verificar instalación
npm list --depth=0
```

### 3. Crear Archivo de Configuración
```bash
# Copiar ejemplo
cp .env.example .env

# Editar con credenciales
nano .env
```

**Contenido de .env:**
```bash
# Environment
NODE_ENV=production
DEBUG=false

# Application
APP_NAME="Esencia y Taza"
APP_URL=https://esenciaytaza.com
APP_PORT=3000
APP_WORKERS=4

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=esencia_taza
DB_USER=esencia_taza
DB_PASSWORD=$(openssl rand -base64 32)

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email (SendGrid/SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-key

# Security
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://esenciaytaza.com

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=https://...

# Stripe (para tienda)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## CONFIGURACIÓN DE BASE DE DATOS

### 1. Crear Base de Datos
```bash
# Conectar a PostgreSQL como superuser
sudo -u postgres psql

# En el prompt de psql:
CREATE USER esencia_taza WITH PASSWORD 'password_from_env';
CREATE DATABASE esencia_taza OWNER esencia_taza;

# Otorgar privilegios
ALTER ROLE esencia_taza SET client_encoding TO 'utf8';
ALTER ROLE esencia_taza SET default_transaction_isolation TO 'read committed';
ALTER ROLE esencia_taza SET default_transaction_deferrable TO on;
ALTER ROLE esencia_taza SET default_transaction_read_only TO off;

# Salir
\q
```

### 2. Ejecutar Migraciones
```bash
# Como usuario esencia-taza
sudo su - esencia-taza -s /bin/bash
cd /var/www/esencia-y-taza

# Ejecutar migraciones
npm run migrate

# Ejecutar seeds (datos iniciales)
npm run seed
```

### 3. Backup Inicial
```bash
# Crear backup
sudo -u postgres pg_dump esencia_taza > /var/backups/esencia_taza_initial.sql

# Verificar
ls -lh /var/backups/
```

---

## CONFIGURACIÓN DE NGINX

### 1. Copiar Configuración
```bash
# Copiar archivo de configuración
sudo cp /var/www/esencia-y-taza/nginx/nginx.conf /etc/nginx/sites-available/esenciaytaza.com

# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/esenciaytaza.com /etc/nginx/sites-enabled/

# Desabilitar sitio default
sudo rm /etc/nginx/sites-enabled/default

# Verificar sintaxis
sudo nginx -t
```

### 2. Crear Directorios de Cache
```bash
# Crear directorios
sudo mkdir -p /var/cache/nginx/{assets,api,html}

# Asignar permisos
sudo chown -R www-data:www-data /var/cache/nginx
sudo chmod -R 755 /var/cache/nginx
```

### 3. Recargar Nginx
```bash
# Recargar configuración
sudo systemctl reload nginx

# Verificar estado
sudo systemctl status nginx
```

---

## CERTIFICADO SSL/TLS

### 1. Obtener Certificado Let's Encrypt
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot certonly --nginx \
    -d esenciaytaza.com \
    -d www.esenciaytaza.com \
    --email admin@esenciaytaza.com \
    --agree-tos \
    --non-interactive

# Verificar certificado
sudo certbot certificates
```

### 2. Configurar Auto-Renovación
```bash
# Habilitar timer de renovación
sudo systemctl enable certbot.timer

# Verificar timer
sudo systemctl status certbot.timer

# Test renovación (dry-run)
sudo certbot renew --dry-run

# Ver próxima renovación
sudo systemctl list-timers --all | grep certbot
```

### 3. Fortalecer Seguridad SSL
```bash
# Agregar HSTS header (en nginx.conf)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Verificar SSL con ssllabs.com o testssl.sh
curl https://esenciaytaza.com -I
```

---

## DESPLIEGUE DE LA APLICACIÓN

### 1. Usar PM2 para Gestionar Proceso
```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Como usuario esencia-taza
sudo su - esencia-taza -s /bin/bash
cd /var/www/esencia-y-taza

# Iniciar con PM2
pm2 start src/server.js --name "esencia-taza" --instances 4 --exec-mode cluster

# Configurar para reiniciar en boot
pm2 startup systemd -u esencia-taza --hp /home/esencia-taza
pm2 save

# Verificar
pm2 list
pm2 monit
```

### 2. Verificar Salud de la Aplicación
```bash
# Ver logs
pm2 logs esencia-taza

# Ver detalles
pm2 show esencia-taza

# Restart si es necesario
pm2 restart esencia-taza
```

### 3. Probar Acceso
```bash
# Test desde el servidor
curl https://esenciaytaza.com

# Test de headers de seguridad
curl -I https://esenciaytaza.com | grep -E "X-Frame|X-Content-Type|Strict-Transport"

# Test de rendimiento
curl -w "@curl-format.txt" https://esenciaytaza.com
```

---

## MONITOREO Y MANTENIMIENTO

### 1. Configurar Monitoreo de Logs
```bash
# Ver logs de Nginx
sudo tail -f /var/log/nginx/esenciaytaza.access.log
sudo tail -f /var/log/nginx/esenciaytaza.error.log

# Ver logs de aplicación
pm2 logs esencia-taza --lines 100

# Usar logrotate para rotación automática
sudo nano /etc/logrotate.d/esencia-taza
```

**Contenido de logrotate:**
```
/var/log/esencia-taza/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 esencia-taza esencia-taza
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
```

### 2. Configurar Monitoreo de Recursos
```bash
# Instalar Netdata (monitor en tiempo real)
curl https://get.netdata.cloud/kickstart.sh | sh

# Ver panel web
# http://localhost:19999

# Configurar alertas (opcional)
sudo nano /etc/netdata/health.d/cpu.conf
```

### 3. Configurar Healthcheck
```bash
# Crear endpoint de healthcheck en la app
# GET /api/health → { "status": "ok", "timestamp": "..." }

# Agregar a cron para monitoreo
sudo crontab -e
```

**Agregar línea:**
```bash
*/5 * * * * curl -s https://esenciaytaza.com/api/health || echo "ERROR" >> /var/log/healthcheck.log
```

### 4. Monitorear Uptime
```bash
# Usar Uptime Robot (servicio externo)
# 1. Ir a https://uptimerobot.com
# 2. Agregar monitor para https://esenciaytaza.com
# 3. Configurar alertas
```

---

## RESPALDO Y RECUPERACIÓN

### 1. Configurar Backup Automático
```bash
# Crear script de backup
sudo nano /usr/local/bin/backup-esencia.sh
```

**Script:**
```bash
#!/bin/bash

BACKUP_DIR="/var/backups/esencia-taza"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="esencia_taza"
DB_USER="esencia_taza"

# Crear directorio
mkdir -p $BACKUP_DIR

# Backup de base de datos
sudo -u postgres pg_dump $DB_NAME | gzip > $BACKUP_DIR/db_${DATE}.sql.gz

# Backup de archivos estáticos
tar -czf $BACKUP_DIR/files_${DATE}.tar.gz \
    /var/www/esencia-y-taza/public/uploads \
    /var/www/esencia-y-taza/.env

# Limpiar backups antiguos (mantener últimos 30 días)
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +30 -delete

# Verificar
ls -lh $BACKUP_DIR/
```

### 2. Ejecutar Backup Diario
```bash
# Hacer ejecutable
sudo chmod +x /usr/local/bin/backup-esencia.sh

# Agregar a cron
sudo crontab -e
```

**Agregar línea:**
```bash
# Backup diario a las 2 AM
0 2 * * * /usr/local/bin/backup-esencia.sh >> /var/log/backups.log 2>&1
```

### 3. Restaurar desde Backup
```bash
# Restaurar base de datos
gunzip < /var/backups/esencia-taza/db_20240115_020000.sql.gz | sudo -u postgres psql esencia_taza

# Restaurar archivos
cd /
sudo tar -xzf /var/backups/esencia-taza/files_20240115_020000.tar.gz

# Verificar
sudo -u postgres psql esencia_taza -c "SELECT COUNT(*) FROM products;"
```

---

## CHECKLIST DE DESPLIEGUE

```
PREPARACIÓN
[ ] Dominio registrado y configurado (DNS A record)
[ ] Servidor Linux configurado
[ ] SSH keys configuradas
[ ] Firewall habilitado

DEPENDENCIAS
[ ] Node.js instalado (v20+)
[ ] PostgreSQL instalado
[ ] Redis instalado
[ ] Nginx instalado

PROYECTO
[ ] Repositorio clonado
[ ] npm ci ejecutado
[ ] npm run build ejecutado
[ ] .env configurado correctamente

BASE DE DATOS
[ ] Usuario PostgreSQL creado
[ ] Base de datos creada
[ ] Migraciones ejecutadas
[ ] Seeds ejecutados
[ ] Backup inicial creado

SSL/TLS
[ ] Certificado Let's Encrypt obtenido
[ ] Auto-renovación configurada
[ ] HSTS header configurado
[ ] Headers de seguridad configurados

APLICACIÓN
[ ] PM2 instalado
[ ] Aplicación iniciada con PM2
[ ] PM2 startup configurado
[ ] Health check funcionando

MONITOREO
[ ] Logs configurados con logrotate
[ ] Monitoreo de recursos activo
[ ] Alertas configuradas
[ ] Backup automático configurado

PRODUCCIÓN
[ ] Google Search Console verificado
[ ] Google Analytics configurado
[ ] Sentry/error tracking configurado
[ ] CDN configurado (opcional)
[ ] Performance test (Lighthouse > 90)
[ ] Security audit completado
```

---

## COMANDOS ÚTILES

```bash
# Ver estado de servicios
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis-server
pm2 status

# Reiniciar servicios
sudo systemctl restart nginx
sudo systemctl restart postgresql
pm2 restart esencia-taza

# Ver logs
tail -f /var/log/nginx/esenciaytaza.error.log
pm2 logs esencia-taza
journalctl -u redis-server -f

# Monitoreo
htop
free -h
df -h
sudo iotop

# Conectar a BD
sudo -u postgres psql esencia_taza
psql -U esencia_taza -h localhost esencia_taza

# Redis
redis-cli ping
redis-cli info

# Verificar puertos
sudo netstat -tlnp | grep -E "3000|80|443|5432|6379"

# Test de velocidad
ab -n 1000 -c 10 https://esenciaytaza.com/
wrk -t 4 -c 100 -d 30s https://esenciaytaza.com/
```

---

## ESCALABILIDAD

### Para Aumentar Carga:

**1. Agregar más workers Node.js**
```bash
pm2 start src/server.js --instances 8 --exec-mode cluster
pm2 save
```

**2. Agregar segundo servidor**
```bash
# En nginx.conf, agregar upstream server
upstream esencia_taza_backend {
    server server1.com:3000;
    server server2.com:3000;
}
```

**3. Agregar load balancer**
```bash
# HAProxy o usar AWS ALB/NLB
```

**4. Optimizar BD**
```bash
# Agregar índices
CREATE INDEX idx_products_origin ON products(origin);
ANALYZE;
```

---

## SEGURIDAD ADICIONAL

```bash
# Fail2Ban (anti brute-force)
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Configurar para SSH
sudo nano /etc/fail2ban/jail.local

[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

# Unattended upgrades (security patches automáticas)
sudo apt install unattended-upgrades
sudo systemctl enable unattended-upgrades
```

---

## SOPORTE Y TROUBLESHOOTING

```bash
# Error: Connection refused
# → Verificar si aplicación está corriendo: pm2 status

# Error: 502 Bad Gateway
# → Verificar logs: tail -f /var/log/nginx/esenciaytaza.error.log
# → Reiniciar app: pm2 restart esencia-taza

# Error: Out of memory
# → Ver memoria: free -h
# → Aumentar swap o agregar RAM
# → Optimizar aplicación

# Error: Certificado SSL inválido
# → Renovar: sudo certbot renew --force-renewal
# → Reload Nginx: sudo systemctl reload nginx

# Base de datos lenta
# → Ver conexiones: psql -c "SELECT count(*) FROM pg_stat_activity;"
# → Analizar queries: EXPLAIN ANALYZE SELECT ...
# → Ver índices: \d+ table_name
```

---

**Documento creado:** 2024  
**Status:** Producción Ready  
**Última revisión:** 2024-01-15