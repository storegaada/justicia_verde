-- Base de datos Justicia Verde - Esquema mejorado para MySQL
CREATE DATABASE IF NOT EXISTS justicia_verde;
USE justicia_verde;

-- Tabla de usuarios con 3 roles: ciudadano (demandante), visualizador (revisor), administrador
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    contrasena VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('ciudadano', 'visualizador', 'administrador') DEFAULT 'ciudadano',
    organizacion VARCHAR(150),
    especialidad VARCHAR(100),
    avatar_url VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_correo (correo),
    INDEX idx_tipo_usuario (tipo_usuario)
);

-- Tabla de categorías de denuncias
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50)
);

-- Tabla de denuncias con geolocalización y prioridad
CREATE TABLE denuncias (
    id_denuncia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,
    tipo_denuncia ENUM('oficial', 'anonima') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion_direccion VARCHAR(200),
    ubicacion_lat DECIMAL(10, 8),
    ubicacion_lng DECIMAL(11, 8),
    prioridad ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
    estado ENUM('RECIBIDA', 'EN_PROCESO', 'RESUELTA', 'RECHAZADA') DEFAULT 'RECIBIDA',
    visibilidad_publica BOOLEAN DEFAULT TRUE,
    vistas INT DEFAULT 0,
    compartidos INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_estado (estado),
    INDEX idx_fecha_creacion (fecha_creacion),
    INDEX idx_ubicacion (ubicacion_lat, ubicacion_lng),
    INDEX idx_prioridad (prioridad)
);

-- Tabla de asignación de denuncias a visualizadores/revisores
CREATE TABLE asignaciones (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_denuncia INT NOT NULL,
    id_visualizador INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_finalizacion TIMESTAMP NULL,
    notas TEXT,
    FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
    FOREIGN KEY (id_visualizador) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_denuncia (id_denuncia),
    INDEX idx_visualizador (id_visualizador)
);

-- Tabla de evidencias (imágenes, videos, documentos)
CREATE TABLE evidencias (
    id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
    id_denuncia INT NOT NULL,
    tipo ENUM('imagen', 'video', 'documento') NOT NULL,
    url_archivo VARCHAR(500) NOT NULL,
    nombre_archivo VARCHAR(255),
    tamano_bytes INT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
    INDEX idx_denuncia (id_denuncia)
);

-- Tabla de seguimientos/comentarios
CREATE TABLE seguimientos (
    id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_denuncia INT NOT NULL,
    id_usuario INT NOT NULL,
    comentario TEXT NOT NULL,
    tipo_seguimiento ENUM('comentario', 'cambio_estado', 'asignacion', 'resolucion') DEFAULT 'comentario',
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_denuncia (id_denuncia),
    INDEX idx_fecha (fecha)
);

-- Tabla de relación denuncias-categorías (muchos a muchos)
CREATE TABLE denuncia_categoria (
    id_denuncia INT NOT NULL,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_denuncia, id_categoria),
    FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
);

-- Tabla de reacciones (likes)
CREATE TABLE reacciones (
    id_reaccion INT AUTO_INCREMENT PRIMARY KEY,
    id_denuncia INT NOT NULL,
    id_usuario INT NOT NULL,
    tipo_reaccion ENUM('like', 'importante', 'preocupante') DEFAULT 'like',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    UNIQUE KEY unique_reaccion (id_denuncia, id_usuario, tipo_reaccion),
    INDEX idx_denuncia (id_denuncia)
);
