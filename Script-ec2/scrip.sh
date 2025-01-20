#!/bin/bash

# Función para imprimir mensajes con asteriscos
print_message() {
    local message="$1"
    local length=${#message}
    local border=$(printf '%*s' $((length + 4)) | tr ' ' '*')
    
    echo "$border"
    echo "* $message *"
    echo "$border"
}

# Actualizar el sistema
print_message "Actualizando el sistema"
sudo dnf update -y

# Instalación de Docker y git
print_message "Instalando Docker y Git"
sudo dnf install docker git -y

# Instalación de docker-compose
print_message "Instalando Docker Compose"
sudo curl -SL https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Iniciar y habilitar docker
print_message "Iniciando servicio Docker"
sudo systemctl start docker
sudo systemctl enable docker

# Instalación de Java Corretto 11
print_message "Instalando Java Corretto 11"
sudo yum install -y java-11-amazon-corretto-headless
java --version

# Instalación y configuración de Maven
print_message "Descargando y configurando Maven"
wget https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz
tar xzf apache-maven-3.9.9-bin.tar.gz
sudo mv apache-maven-3.9.9 /opt/maven

# Crear archivo de configuración de Maven
print_message "Configurando variables de entorno para Maven"
sudo tee /etc/profile.d/maven.sh << 'EOF'
export JAVA_HOME=/usr/lib/jvm/java-11-amazon-corretto
export M2_HOME=/opt/maven
export MAVEN_HOME=/opt/maven
export PATH=$M2_HOME/bin:$PATH
EOF

# Aplicar la configuración
source /etc/profile.d/maven.sh

# Verificar instalación
print_message "Verificando la instalación de Maven"
mvn -v

print_message "¡Instalación completada!"

# Instrucciones finales para el usuario
print_message "IMPORTANTE: Pasos adicionales requeridos"
echo "Para comenzar a usar Maven, necesitas hacer UNA de estas dos cosas:"
echo "1. Ejecuta este comando en tu terminal actual:"
echo "   source /etc/profile.d/maven.sh"
echo "2. O cierra esta terminal y abre una nueva"
echo ""
echo "Después de hacer uno de estos pasos, el comando 'mvn -v' funcionará correctamente."
echo "****************************************"
echo "Agregar ssm-user al grupo de docker"
echo "sudo usermod -aG docker ssm-user"
echo "exit <-- para salir de la terminal y se apliquen los cambios"