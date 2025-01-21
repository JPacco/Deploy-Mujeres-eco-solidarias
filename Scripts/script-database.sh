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

# Configuración de variables
CONTAINER_NAME="tu-contenedor-postgres"
DB_USER="tu-usuario"
DB_NAME="tu-base-de-datos"

# Array ordenado de scripts
ORDERED_SQL_FILES=(
    "db_reciclaje_2024.sql"
    "script_insert_parametros.sql"
    "script_insert_ubigeo.sql"
)

# Verificar que el contenedor está corriendo
print_message "Verificando estado del contenedor"
if ! docker ps | grep -q $CONTAINER_NAME; then
    print_message "ERROR: El contenedor $CONTAINER_NAME no está corriendo"
    exit 1
fi

# Verificar que todos los archivos existen
print_message "Verificando archivos SQL"
for file in "${ORDERED_SQL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_message "ERROR: No se encuentra el archivo $file"
        exit 1
    fi
done

# Ejecutar los archivos SQL en orden
for file in "${ORDERED_SQL_FILES[@]}"; do
    print_message "Ejecutando $file"
    print_message "Este proceso puede tomar varios minutos..."
    
    docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < "$file"
    
    if [ $? -eq 0 ]; then
        print_message "Archivo $file ejecutado exitosamente"
    else
        print_message "ERROR: Hubo un problema al ejecutar $file"
        print_message "Deteniendo la ejecución para evitar inconsistencias"
        exit 1
    fi
    
    # Pequeña pausa entre scripts para asegurar que todo se procese correctamente
    sleep 2
done

print_message "Proceso de inicialización completado exitosamente"
print_message "Base de datos inicializada en el siguiente orden:"
for file in "${ORDERED_SQL_FILES[@]}"; do
    echo "- $file"
done