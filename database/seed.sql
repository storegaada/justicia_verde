-- Datos de prueba para Justicia Verde
USE justicia_verde;

-- Insertar usuarios de prueba (contraseña: 12345678)
INSERT INTO usuarios (nombre_completo, correo, telefono, contrasena, tipo_usuario, organizacion, especialidad) VALUES
('Administrador Sistema', 'admin@gmail.com', '3001234567', '12345678', 'administrador', 'Justicia Verde', 'Gestión ambiental'),
('María García', 'demandante@gmail.com', '3109876543', '12345678', 'ciudadano', NULL, NULL),
('Carlos Rodríguez', 'visualizador@gmail.com', '3157654321', '12345678', 'visualizador', 'Grupo VerdeLex', 'Derecho ambiental'),
('Ana Torres', 'ana@mail.com', '3222222222', '12345678', 'ciudadano', NULL, NULL),
('Juan Pérez', 'juan@mail.com', '3111111111', '12345678', 'ciudadano', NULL, NULL),
('Laura Martínez', 'laura@verdelex.org', '3145678901', '12345678', 'visualizador', 'Grupo VerdeLex', 'Asesoría legal'),
('Pedro Sánchez', 'pedro@protectores.org', '3198765432', '12345678', 'visualizador', 'Protectores del Río', 'Contaminación hídrica');

-- Insertar categorías
INSERT INTO categorias (nombre_categoria, descripcion, icono) VALUES
('Deforestación', 'Tala ilegal de árboles y destrucción de bosques', 'tree'),
('Minería ilegal', 'Extracción no autorizada de minerales', 'mountain'),
('Contaminación hídrica', 'Contaminación de ríos, lagos y fuentes de agua', 'droplet'),
('Caza ilegal', 'Caza y tráfico de fauna silvestre', 'bird'),
('Contaminación del aire', 'Emisiones tóxicas y contaminación atmosférica', 'wind'),
('Quema de bosques', 'Incendios forestales provocados', 'flame'),
('Vertimiento de residuos', 'Disposición ilegal de basuras y residuos tóxicos', 'trash'),
('Tráfico de fauna', 'Comercio ilegal de animales silvestres', 'paw-print');

-- Insertar denuncias de prueba con coordenadas reales de Colombia
INSERT INTO denuncias (id_usuario, tipo_denuncia, titulo, descripcion, ubicacion_direccion, ubicacion_lat, ubicacion_lng, prioridad, estado, visibilidad_publica) VALUES
(2, 'oficial', 'Tala masiva de árboles en zona protegida', 'Se está realizando tala indiscriminada en el Parque Nacional Natural. Maquinaria pesada destruyendo el bosque nativo.', 'Parque Nacional Natural, Bogotá', 4.7110, -74.0721, 'critica', 'EN_PROCESO', TRUE),
(4, 'oficial', 'Vertimiento de químicos al Río Cauca', 'Empresa textil descargando aguas residuales sin tratamiento directamente al río. El agua tiene un color oscuro y olor fuerte.', 'Río Cauca, Cali', 3.4516, -76.5320, 'alta', 'EN_PROCESO', TRUE),
(NULL, 'anonima', 'Minería ilegal cerca al Río Magdalena', 'Maquinaria excavando ilegalmente en la ribera del río. Operan principalmente de noche.', 'Río Magdalena, Barrancabermeja', 7.0653, -73.8547, 'alta', 'RECIBIDA', TRUE),
(5, 'oficial', 'Quema de bosque en zona rural', 'Incendio provocado para ampliar terrenos de cultivo. Afecta fauna silvestre de la región.', 'Vereda El Bosque, Medellín', 6.2442, -75.5812, 'critica', 'RESUELTA', TRUE),
(2, 'oficial', 'Caza ilegal de aves exóticas', 'Traficantes capturando loros y guacamayas para venta ilegal. Operan en horas de la madrugada.', 'Reserva Natural, Amazonas', -4.2058, -69.9406, 'media', 'RECIBIDA', TRUE),
(4, 'anonima', 'Contaminación por fábrica de plásticos', 'Fábrica emitiendo humo negro constantemente. Afecta la salud de los residentes cercanos.', 'Zona Industrial, Cartagena', 10.3910, -75.4794, 'alta', 'EN_PROCESO', TRUE),
(5, 'oficial', 'Vertedero ilegal de basuras', 'Botadero clandestino en zona residencial. Malos olores y proliferación de plagas.', 'Barrio Popular, Bucaramanga', 7.1193, -73.1227, 'media', 'RECIBIDA', TRUE),
(NULL, 'anonima', 'Pesca con dinamita en zona costera', 'Pescadores usando explosivos para captura masiva. Destruyendo arrecifes de coral.', 'Bahía Solano, Chocó', 6.2167, -77.4000, 'critica', 'RECIBIDA', TRUE);

-- Relacionar denuncias con categorías
INSERT INTO denuncia_categoria (id_denuncia, id_categoria) VALUES
(1, 1), -- Deforestación
(2, 3), -- Contaminación hídrica
(3, 2), -- Minería ilegal
(4, 6), -- Quema de bosques
(4, 1), -- Deforestación
(5, 4), -- Caza ilegal
(5, 8), -- Tráfico de fauna
(6, 5), -- Contaminación del aire
(7, 7), -- Vertimiento de residuos
(8, 4); -- Caza ilegal

-- Insertar evidencias
INSERT INTO evidencias (id_denuncia, tipo, url_archivo, nombre_archivo) VALUES
(1, 'imagen', '/placeholder.svg?height=400&width=600', 'tala_bosque_1.jpg'),
(1, 'imagen', '/placeholder.svg?height=400&width=600', 'maquinaria_pesada.jpg'),
(2, 'video', '/placeholder.svg?height=400&width=600', 'vertimiento_rio.mp4'),
(2, 'imagen', '/placeholder.svg?height=400&width=600', 'agua_contaminada.jpg'),
(3, 'imagen', '/placeholder.svg?height=400&width=600', 'mineria_ilegal.jpg'),
(4, 'imagen', '/placeholder.svg?height=400&width=600', 'incendio_forestal.jpg'),
(5, 'imagen', '/placeholder.svg?height=400&width=600', 'aves_capturadas.jpg'),
(6, 'imagen', '/placeholder.svg?height=400&width=600', 'humo_fabrica.jpg'),
(7, 'imagen', '/placeholder.svg?height=400&width=600', 'vertedero_ilegal.jpg'),
(8, 'imagen', '/placeholder.svg?height=400&width=600', 'pesca_dinamita.jpg');

-- Asignar visualizadores a algunas denuncias
INSERT INTO asignaciones (id_denuncia, id_visualizador, notas) VALUES
(1, 3, 'Caso asignado para revisión legal y acompañamiento'),
(2, 7, 'Requiere inspección técnica del río'),
(6, 3, 'Coordinación con autoridades ambientales');

-- Insertar seguimientos
INSERT INTO seguimientos (id_denuncia, id_usuario, comentario, tipo_seguimiento, estado_anterior, estado_nuevo) VALUES
(1, 1, 'Denuncia recibida. Se está verificando la información.', 'cambio_estado', NULL, 'RECIBIDA'),
(1, 3, 'Caso asignado a Grupo VerdeLex para acompañamiento legal.', 'asignacion', 'RECIBIDA', 'EN_PROCESO'),
(1, 3, 'Se realizó inspección en el sitio. Evidencia fotográfica recopilada.', 'comentario', NULL, NULL),
(2, 1, 'Denuncia recibida y validada.', 'cambio_estado', NULL, 'RECIBIDA'),
(2, 7, 'Protectores del Río tomó el caso. Se contactará a autoridades ambientales.', 'asignacion', 'RECIBIDA', 'EN_PROCESO'),
(3, 1, 'Denuncia anónima recibida. Pendiente de verificación.', 'comentario', NULL, NULL),
(4, 1, 'Caso resuelto. Autoridades intervinieron y controlaron el incendio.', 'cambio_estado', 'EN_PROCESO', 'RESUELTA'),
(6, 3, 'Iniciando proceso legal contra la fábrica.', 'comentario', NULL, NULL);

-- Insertar reacciones (likes)
INSERT INTO reacciones (id_denuncia, id_usuario, tipo_reaccion) VALUES
(1, 2, 'like'),
(1, 4, 'importante'),
(1, 5, 'preocupante'),
(2, 2, 'importante'),
(2, 5, 'like'),
(3, 4, 'preocupante'),
(4, 2, 'like'),
(5, 4, 'importante'),
(6, 5, 'preocupante'),
(7, 2, 'like');

-- Actualizar contador de vistas
UPDATE denuncias SET vistas = FLOOR(RAND() * 500) + 50 WHERE id_denuncia <= 8;
UPDATE denuncias SET compartidos = FLOOR(RAND() * 50) + 5 WHERE id_denuncia <= 8;
