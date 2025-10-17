# Credenciales de Acceso - Justicia Verde

## Usuarios de Prueba

La plataforma cuenta con 3 roles diferentes. Usa estas credenciales para probar cada uno:

### 1. Administrador
- **Email:** `admin@gmail.com`
- **Contraseña:** `12345678`
- **Acceso a:**
  - Panel de administración completo
  - Gestión de todas las denuncias
  - Estadísticas globales
  - Asignación de revisores
  - Validación y moderación de contenido

### 2. Demandante (Usuario Ciudadano)
- **Email:** `demandante@gmail.com`
- **Contraseña:** `12345678`
- **Acceso a:**
  - Crear nuevas denuncias
  - Ver sus propias denuncias
  - Seguimiento del estado de sus casos
  - Comentar en denuncias públicas
  - Exportar sus datos

### 3. Visualizador/Revisor (Abogado/ONG)
- **Email:** `visualizador@gmail.com`
- **Contraseña:** `12345678`
- **Acceso a:**
  - Ver todas las denuncias disponibles
  - Tomar casos para revisión
  - Actualizar estado de denuncias
  - Comunicarse con demandantes
  - Generar reportes de casos

## Funcionalidades por Rol

### Administrador
- Dashboard con métricas completas
- Gestión de usuarios (activar/desactivar)
- Moderación de contenido
- Asignación manual de revisores
- Acceso a todas las denuncias (públicas y privadas)
- Exportación de datos completos

### Demandante
- Formulario de denuncia con geolocalización
- Carga de evidencias (fotos/videos)
- Vista de "Mis Denuncias" con filtros
- Notificaciones de cambios de estado
- Opción de denuncia anónima

### Visualizador/Revisor
- Panel de casos disponibles
- Sistema de "tomar caso"
- Actualización de estado de denuncias
- Comunicación con demandantes
- Estadísticas personales de casos resueltos

## Navegación

Después de iniciar sesión, cada rol será redirigido automáticamente a su página principal:
- **Admin** → `/admin`
- **Demandante** → `/mis-denuncias`
- **Visualizador** → `/revisor`

## Estado de Integración con Firebase

### Configurado ✅
- Firebase SDK instalado
- Servicios de Firestore y Storage implementados
- Funciones para guardar denuncias y archivos
- Configuración lista para recibir credenciales

### Pendiente ⏳
- Agregar credenciales de Firebase en variables de entorno
- Habilitar Firebase Authentication
- Configurar reglas de seguridad en Firebase Console

## Configuración de Variables de Entorno

Para conectar con Firebase, necesitas agregar estas variables en Vercel o en tu archivo `.env.local`:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
\`\`\`

## Próximos Pasos

1. ✅ Preparar estructura de Firebase
2. ⏳ Agregar credenciales de Firebase
3. ⏳ Conectar Firebase Authentication
4. ⏳ Implementar sistema de notificaciones en tiempo real
5. ⏳ Agregar analytics y monitoreo
