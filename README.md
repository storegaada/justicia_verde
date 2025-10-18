# Justicia Verde - Plataforma de Denuncias Ambientales

Plataforma ciudadana para denunciar, visibilizar y combatir delitos ambientales en Colombia mediante tecnología, participación ciudadana y apoyo legal.

## Características

### Sistema de Roles

La plataforma cuenta con 3 roles principales:

1. **Administrador (Admin)**
   - Gestión completa de la plataforma
   - Visualización de todas las denuncias y usuarios
   - Estadísticas globales
   - Validación y moderación de reportes

2. **Demandante (Ciudadano)**
   - Crear denuncias ambientales (anónimas o con identidad)
   - Seguimiento de denuncias propias
   - Interacción con denuncias públicas (likes, comentarios)
   - Exportación de datos personales

3. **Revisor (Profesional Legal)**
   - Tomar casos disponibles
   - Gestionar denuncias en proceso
   - Comunicación con denunciantes
   - Marcar casos como resueltos

### Funcionalidades Principales

- **Mapa Interactivo**: Visualización de denuncias en tiempo real con marcadores por prioridad
- **Sistema de Denuncias**: Formulario completo con geolocalización y carga de evidencias
- **Red Social Ambiental**: Likes, comentarios, compartidos y vistas en denuncias públicas
- **Datos Abiertos**: Estadísticas públicas y reportes descargables
- **Contactos Útiles**: Directorio de organizaciones de apoyo legal y técnico

## Tecnologías

- **Frontend**: Next.js 15, React, TypeScript
- **Estilos**: Tailwind CSS v4, shadcn/ui
- **Mapas**: Leaflet con OpenStreetMap
- **Backend**: MySQL + Next.js API Routes
- **Base de datos**: MySQL Workbench (local)

## Instalación

\`\`\`bash
# Instalar dependencias
npm install

# Configurar base de datos MySQL (ver MYSQL_SETUP.md)
# Ejecutar scripts en database/schema.sql y database/seed.sql

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
\`\`\`

## Configuración de MySQL

Para conectar con MySQL local, crea un archivo `.env.local` con las siguientes variables:

\`\`\`env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=justicia_verde
\`\`\`

**Ver documentación completa en [MYSQL_SETUP.md](./MYSQL_SETUP.md)**

### Pasos rápidos:

1. Instala MySQL Workbench
2. Ejecuta `database/schema.sql` para crear las tablas
3. Ejecuta `database/seed.sql` para insertar datos de prueba
4. Configura `.env.local` con tus credenciales
5. Ejecuta `npm run dev`

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── admin/          # Panel de administración
│   ├── revisor/        # Panel de revisor
│   ├── cuenta/         # Login/Registro
│   ├── denuncia/       # Formulario de denuncia
│   ├── mapa/           # Mapa interactivo
│   ├── mis-denuncias/  # Gestión personal
│   ├── datos-abiertos/ # Estadísticas públicas
│   └── api/            # API Routes para MySQL
│       ├── auth/
│       ├── denuncias/
│       ├── seguimientos/
│       └── estadisticas/
├── components/
│   ├── mapa-interactivo.tsx
│   ├── navbar.tsx
│   └── ui/             # Componentes shadcn
├── database/
│   ├── schema.sql      # Esquema de base de datos
│   └── seed.sql        # Datos de prueba
├── lib/
│   ├── auth-context.tsx    # Contexto de autenticación
│   ├── db-config.ts        # Configuración MySQL
│   ├── db-services.ts      # Servicios de base de datos
│   └── mock-data.ts        # Datos de prueba (fallback)
└── types/
    └── index.ts        # Tipos TypeScript
\`\`\`

## APIs Disponibles

- `POST /api/auth/login` - Autenticación de usuarios
- `GET /api/denuncias` - Obtener denuncias públicas
- `POST /api/denuncias` - Crear nueva denuncia
- `PATCH /api/denuncias/[id]` - Actualizar estado
- `POST /api/denuncias/[id]/asignar` - Asignar visualizador
- `POST /api/denuncias/[id]/like` - Dar/quitar like
- `GET /api/seguimientos` - Obtener comentarios
- `POST /api/seguimientos` - Agregar comentario
- `GET /api/estadisticas` - Estadísticas generales

## Próximos Pasos

1. ✅ Base de datos MySQL configurada
2. ✅ APIs REST implementadas
3. ✅ Sistema de autenticación funcional
4. Implementar hash de contraseñas (bcrypt)
5. Agregar carga de archivos (multer o similar)
6. Implementar validación de datos con Zod
7. Agregar rate limiting para APIs
8. Implementar notificaciones por email

## Licencia

MIT
