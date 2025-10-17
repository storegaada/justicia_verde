# Guía de Despliegue en Vercel

## Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Proyecto de Firebase configurado
3. Repositorio Git (GitHub, GitLab, o Bitbucket)

## Configuración de Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Firestore Database:
   - Ve a Build > Firestore Database
   - Clic en "Create database"
   - Selecciona modo "production" o "test"
   - Elige la ubicación (recomendado: us-central1 para Colombia)

### 2. Habilitar Storage

1. Ve a Build > Storage
2. Clic en "Get started"
3. Acepta las reglas de seguridad predeterminadas

### 3. Obtener Credenciales

1. Ve a Project Settings (ícono de engranaje)
2. En la pestaña "General", baja hasta "Your apps"
3. Clic en el ícono de web (</>)
4. Registra tu app con un nombre
5. Copia las credenciales del objeto `firebaseConfig`

### 4. Configurar Reglas de Seguridad

**Firestore Rules** (Build > Firestore Database > Rules):

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Denuncias - lectura pública, escritura autenticada
    match /denuncias/{denunciaId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.denunciante.id || 
         get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Comentarios - lectura pública, escritura autenticada
    match /comentarios/{comentarioId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.usuarioId;
    }
    
    // Usuarios - solo el dueño puede leer/escribir
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
\`\`\`

**Storage Rules** (Build > Storage > Rules):

\`\`\`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /evidencias/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.resource.size < 10 * 1024 * 1024 && // 10MB max
        request.resource.contentType.matches('image/.*|video/.*');
    }
  }
}
\`\`\`

## Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/justicia-verde.git
   git push -u origin main
   \`\`\`

2. **Conecta con Vercel**
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Clic en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configura Variables de Entorno**
   - En la sección "Environment Variables", agrega:
     \`\`\`
     NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
     \`\`\`
   - **IMPORTANTE**: Asegúrate de agregar estas variables para los tres ambientes:
     - Production
     - Preview
     - Development

4. **Despliega**
   - Clic en "Deploy"
   - Espera a que termine el build (2-3 minutos)
   - Tu app estará disponible en `https://tu-proyecto.vercel.app`

### Opción 2: Desde CLI de Vercel

1. **Instala Vercel CLI**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Login en Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Despliega**
   \`\`\`bash
   vercel
   \`\`\`

4. **Configura variables de entorno**
   \`\`\`bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   # ... repite para todas las variables
   \`\`\`

5. **Despliega a producción**
   \`\`\`bash
   vercel --prod
   \`\`\`

## Verificación Post-Despliegue

1. **Prueba la aplicación**
   - Visita tu URL de Vercel
   - Intenta crear una denuncia
   - Verifica que se guarde en Firestore

2. **Revisa los logs**
   - En Vercel Dashboard > tu proyecto > Deployments
   - Clic en el deployment más reciente
   - Revisa la pestaña "Functions" para ver logs

3. **Monitorea Firebase**
   - Ve a Firebase Console
   - Revisa Firestore Database para ver las denuncias creadas
   - Revisa Storage para ver las imágenes subidas

## Solución de Problemas

### Error: "Firebase not configured"
- Verifica que todas las variables de entorno estén configuradas en Vercel
- Asegúrate de que los nombres empiecen con `NEXT_PUBLIC_`

### Error: "Permission denied" en Firestore
- Revisa las reglas de seguridad en Firebase Console
- Asegúrate de que las reglas permitan lectura pública

### Imágenes no cargan
- Verifica que el dominio de Firebase Storage esté en `next.config.mjs`
- Revisa las reglas de Storage en Firebase

### Build falla en Vercel
- Revisa los logs de build en Vercel
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que no haya errores de TypeScript

### Error: "Cannot find module '@tailwindcss/postcss'"
- Este error ya está resuelto en el `package.json` actualizado
- Asegúrate de que `@tailwindcss/postcss` esté en devDependencies
- Verifica que existe el archivo `postcss.config.mjs`

### Error: "Cannot find module '@radix-ui/react-slot'"
- Este error ya está resuelto en el `package.json` actualizado
- Todas las dependencias de Radix UI están incluidas

## Actualizaciones Futuras

Para actualizar tu aplicación:

1. **Haz cambios en tu código local**
2. **Commit y push a GitHub**
   \`\`\`bash
   git add .
   git commit -m "Descripción de cambios"
   git push
   \`\`\`
3. **Vercel desplegará automáticamente** los cambios

## Dominio Personalizado

1. Ve a Vercel Dashboard > tu proyecto > Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

## Monitoreo y Analytics

- Vercel proporciona analytics automáticos
- Puedes ver métricas en Dashboard > tu proyecto > Analytics
- Firebase también proporciona analytics en la consola

## Costos

- **Vercel**: Plan gratuito incluye:
  - 100 GB de ancho de banda
  - Despliegues ilimitados
  - HTTPS automático

- **Firebase**: Plan gratuito (Spark) incluye:
  - 1 GB de almacenamiento
  - 10 GB de transferencia/mes
  - 50K lecturas/día en Firestore

Para producción, considera actualizar a planes pagos según el uso.
