#!/bin/bash

dnf update -y

# Instalación de Docker y git
dnf install docker git -y

# Instalación de docker-compose
curl -SL https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Iniciar y habilitar docker
systemctl start docker
systemctl enable docker