# Configuración de MySQL para Justicia Verde

## Requisitos previos

- MySQL Workbench instalado
- MySQL Server 8.0 o superior

## Pasos de instalación

### 1. Crear la base de datos

Abre MySQL Workbench y ejecuta los siguientes scripts en orden:

#### a) Crear el esquema
\`\`\`bash
# Ejecutar el archivo database/schema.sql
\`\`\`

Este script creará:
- Base de datos `justicia_verde`
- Tablas: usuarios, categorias, denuncias, asignaciones, evidencias, seguimientos, denuncia_categoria, reacciones

#### b) Insertar datos de prueba
\`\`\`bash
# Ejecutar el archivo database/seed.sql
\`\`\`

Este script insertará:
- 7 usuarios de prueba (admin, demandantes, visualizadores)
- 8 categorías de denuncias
- 8 denuncias de ejemplo con coordenadas reales de Colombia
- Evidencias, seguimientos y reacciones

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=justicia_verde
\`\`\`

**Importante:** Reemplaza `tu_contraseña_mysql` con tu contraseña real de MySQL.

### 3. Instalar dependencias

\`\`\`bash
npm install
# o
bun install
\`\`\`

### 4. Ejecutar el proyecto

\`\`\`bash
npm run dev
# o
bun dev
\`\`\`

## Credenciales de prueba

### Administrador
- Email: `admin@gmail.com`
- Contraseña: `12345678`
- Acceso: Panel completo de administración

### Demandante (Ciudadano)
- Email: `demandante@gmail.com`
- Contraseña: `12345678`
- Acceso: Crear denuncias, ver mis denuncias

### Visualizador (Revisor)
- Email: `visualizador@gmail.com`
- Contraseña: `12345678`
- Acceso: Revisar denuncias, tomar casos, agregar seguimientos

## Estructura de la base de datos

### Tablas principales

1. **usuarios**: Almacena información de usuarios con 3 roles
   - ciudadano (demandante)
   - visualizador (revisor/abogado)
   - administrador

2. **denuncias**: Denuncias ambientales con geolocalización
   - Coordenadas lat/lng para el mapa
   - Estados: RECIBIDA, EN_PROCESO, RESUELTA, RECHAZADA
   - Prioridad: baja, media, alta, critica

3. **asignaciones**: Relación entre denuncias y visualizadores
   - Permite que un visualizador tome un caso

4. **evidencias**: Archivos multimedia de las denuncias
   - Imágenes, videos, documentos

5. **seguimientos**: Comentarios y cambios de estado
   - Historial completo de cada denuncia

6. **reacciones**: Sistema de likes/reacciones
   - Los usuarios pueden reaccionar a las denuncias

## APIs disponibles

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Denuncias
- `GET /api/denuncias` - Obtener denuncias públicas
- `GET /api/denuncias?usuarioId=X` - Denuncias de un usuario
- `GET /api/denuncias?visualizadorId=X` - Denuncias asignadas a visualizador
- `POST /api/denuncias` - Crear nueva denuncia
- `PATCH /api/denuncias/[id]` - Actualizar estado
- `POST /api/denuncias/[id]/asignar` - Asignar visualizador
- `POST /api/denuncias/[id]/like` - Dar/quitar like

### Seguimientos
- `GET /api/seguimientos?denunciaId=X` - Obtener comentarios
- `POST /api/seguimientos` - Agregar comentario

### Estadísticas
- `GET /api/estadisticas` - Estadísticas generales

## Verificar la conexión

El sistema intentará conectarse a MySQL automáticamente. Si hay problemas:

1. Verifica que MySQL Server esté corriendo
2. Confirma las credenciales en `.env.local`
3. Asegúrate de que la base de datos `justicia_verde` exista
4. Revisa los logs en la consola del servidor

## Solución de problemas

### Error: "Cannot connect to MySQL"
- Verifica que MySQL Server esté corriendo
- Confirma el puerto (por defecto 3306)
- Revisa usuario y contraseña

### Error: "Database does not exist"
- Ejecuta el script `database/schema.sql` primero

### Error: "Access denied"
- Verifica las credenciales en `.env.local`
- Asegúrate de que el usuario tenga permisos

## Migración desde Firebase

Si estabas usando Firebase anteriormente:

1. Los datos de Firebase NO se migrarán automáticamente
2. Usa los datos de prueba en `database/seed.sql`
3. Las credenciales de usuario cambiaron a las listadas arriba
4. El sistema ahora usa MySQL en lugar de Firestore

## Próximos pasos

Una vez configurado MySQL:

1. Prueba el login con las credenciales de prueba
2. Crea una denuncia como demandante
3. Asigna casos como visualizador
4. Gestiona todo desde el panel de admin

Para producción, considera:
- Usar variables de entorno seguras
- Implementar hash de contraseñas (bcrypt)
- Agregar validación de datos
- Implementar rate limiting
- Usar conexiones SSL para MySQL
