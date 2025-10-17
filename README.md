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
- **Backend (Preparado)**: Firebase/Firestore
- **Autenticación (Preparado)**: Firebase Auth

## Instalación

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
\`\`\`

## Configuración de Firebase

Para conectar con Firebase, crea un archivo `.env.local` con las siguientes variables:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
\`\`\`

## Credenciales de Prueba

### Administrador
- **Email**: `admin@gmail.com`
- **Contraseña**: `12345678`
- **Acceso**: Panel de administración completo, gestión de todas las denuncias, estadísticas globales

### Demandante (Ciudadano)
- **Email**: `demandante@gmail.com`
- **Contraseña**: `12345678`
- **Acceso**: Crear denuncias, ver mis denuncias, seguimiento de casos propios

### Visualizador/Revisor (Profesional Legal)
- **Email**: `visualizador@gmail.com`
- **Contraseña**: `12345678`
- **Acceso**: Ver todas las denuncias, tomar casos, actualizar estados, comunicarse con demandantes

**Nota**: Después de iniciar sesión, cada rol será redirigido automáticamente:
- Admin → `/admin`
- Demandante → `/mis-denuncias`
- Visualizador → `/revisor`

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── admin/          # Panel de administración
│   ├── revisor/        # Panel de revisor
│   ├── cuenta/         # Login/Registro
│   ├── denuncia/       # Formulario de denuncia
│   ├── mapa/           # Mapa interactivo
│   ├── mis-denuncias/  # Gestión personal
│   └── datos-abiertos/ # Estadísticas públicas
├── components/
│   ├── mapa-interactivo.tsx
│   ├── navbar.tsx
│   └── ui/             # Componentes shadcn
├── lib/
│   ├── auth-context.tsx    # Contexto de autenticación
│   ├── firebase-config.ts  # Configuración Firebase
│   └── mock-data.ts        # Datos de prueba
└── types/
    └── index.ts        # Tipos TypeScript
\`\`\`

## Próximos Pasos

1. Proporcionar credenciales de Firebase para conectar base de datos real
2. Implementar autenticación con Firebase Auth
3. Migrar datos mock a Firestore
4. Implementar carga de imágenes a Firebase Storage
5. Agregar notificaciones en tiempo real
6. Implementar sistema de gamificación

## Licencia

MIT
