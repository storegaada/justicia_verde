// Servicios de base de datos para MySQL
import { query } from "./db-config"
import type { Denuncia, User, Comentario, UserRole, DenunciaStatus } from "@/types"

// Interfaces para resultados de MySQL
interface DenunciaRow {
  id_denuncia: number
  id_usuario: number | null
  tipo_denuncia: "oficial" | "anonima"
  titulo: string
  descripcion: string
  ubicacion_direccion: string | null
  ubicacion_lat: number | null
  ubicacion_lng: number | null
  prioridad: "baja" | "media" | "alta" | "critica"
  estado: DenunciaStatus
  visibilidad_publica: boolean
  vistas: number
  compartidos: number
  fecha_creacion: Date
  fecha_actualizacion: Date
  // Campos de JOIN
  nombre_completo?: string
  correo?: string
  categorias?: string
  evidencias?: string
  likes?: number
  visualizador_id?: number
  visualizador_nombre?: string
  visualizador_organizacion?: string
}

interface UsuarioRow {
  id_usuario: number
  nombre_completo: string
  correo: string
  telefono: string | null
  contrasena: string
  tipo_usuario: "ciudadano" | "visualizador" | "administrador"
  organizacion: string | null
  especialidad: string | null
  avatar_url: string | null
  fecha_registro: Date
  activo: boolean
}

// Mapear tipo_usuario de DB a UserRole del frontend
function mapTipoUsuarioToRole(tipo: string): UserRole {
  switch (tipo) {
    case "administrador":
      return "admin"
    case "visualizador":
      return "revisor"
    case "ciudadano":
    default:
      return "demandante"
  }
}

// Mapear UserRole a tipo_usuario de DB
function mapRoleToTipoUsuario(role: UserRole): string {
  switch (role) {
    case "admin":
      return "administrador"
    case "revisor":
      return "visualizador"
    case "demandante":
    default:
      return "ciudadano"
  }
}

// Convertir row de DB a objeto Denuncia del frontend
function mapRowToDenuncia(row: DenunciaRow): Denuncia {
  return {
    id: row.id_denuncia.toString(),
    tipo: (row.categorias?.split(",")[0] as any) || "Otro",
    titulo: row.titulo,
    descripcion: row.descripcion,
    ubicacion: {
      lat: row.ubicacion_lat || 0,
      lng: row.ubicacion_lng || 0,
      direccion: row.ubicacion_direccion || undefined,
    },
    evidencias: row.evidencias ? row.evidencias.split(",") : [],
    denunciante:
      row.tipo_denuncia === "anonima"
        ? { anonimo: true }
        : {
            id: row.id_usuario?.toString(),
            nombre: row.nombre_completo,
            email: row.correo,
            anonimo: false,
          },
    status: row.estado,
    fechaCreacion: row.fecha_creacion.toISOString(),
    fechaActualizacion: row.fecha_actualizacion.toISOString(),
    prioridad: row.prioridad,
    visibilidadPublica: row.visibilidad_publica,
    reacciones: {
      likes: row.likes || 0,
      usuariosLike: [],
    },
    comentarios: [],
    vistas: row.vistas,
    compartidos: row.compartidos,
    revisor: row.visualizador_id
      ? {
          id: row.visualizador_id.toString(),
          nombre: row.visualizador_nombre || "",
          organizacion: row.visualizador_organizacion || "",
        }
      : undefined,
  }
}

// Servicios de Usuarios
export const usuarioService = {
  // Autenticar usuario
  async autenticar(correo: string, contrasena: string): Promise<User | null> {
    try {
      const sql = `
        SELECT * FROM usuarios 
        WHERE correo = ? AND contrasena = ? AND activo = TRUE
      `
      const results = await query<UsuarioRow[]>(sql, [correo, contrasena])

      if (results.length === 0) return null

      const row = results[0]
      return {
        id: row.id_usuario.toString(),
        nombre: row.nombre_completo,
        email: row.correo,
        role: mapTipoUsuarioToRole(row.tipo_usuario),
        organizacion: row.organizacion || undefined,
        telefono: row.telefono || undefined,
        avatar: row.avatar_url || undefined,
        fechaRegistro: row.fecha_registro.toISOString(),
        activo: row.activo,
        especialidad: row.especialidad || undefined,
      }
    } catch (error) {
      console.error("[v0] Error al autenticar usuario:", error)
      return null
    }
  },

  // Obtener usuario por ID
  async obtenerPorId(id: string): Promise<User | null> {
    try {
      const sql = "SELECT * FROM usuarios WHERE id_usuario = ?"
      const results = await query<UsuarioRow[]>(sql, [Number.parseInt(id)])

      if (results.length === 0) return null

      const row = results[0]
      return {
        id: row.id_usuario.toString(),
        nombre: row.nombre_completo,
        email: row.correo,
        role: mapTipoUsuarioToRole(row.tipo_usuario),
        organizacion: row.organizacion || undefined,
        telefono: row.telefono || undefined,
        avatar: row.avatar_url || undefined,
        fechaRegistro: row.fecha_registro.toISOString(),
        activo: row.activo,
        especialidad: row.especialidad || undefined,
      }
    } catch (error) {
      console.error("[v0] Error al obtener usuario:", error)
      return null
    }
  },

  // Crear nuevo usuario
  async crear(usuario: Omit<User, "id" | "fechaRegistro" | "activo"> & { contrasena: string }): Promise<string | null> {
    try {
      const sql = `
        INSERT INTO usuarios (nombre_completo, correo, telefono, contrasena, tipo_usuario, organizacion, especialidad)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      const result: any = await query(sql, [
        usuario.nombre,
        usuario.email,
        usuario.telefono || null,
        usuario.contrasena,
        mapRoleToTipoUsuario(usuario.role),
        usuario.organizacion || null,
        usuario.especialidad || null,
      ])

      return result.insertId.toString()
    } catch (error) {
      console.error("[v0] Error al crear usuario:", error)
      return null
    }
  },
}

// Servicios de Denuncias
export const denunciaService = {
  // Obtener todas las denuncias públicas
  async obtenerPublicas(): Promise<Denuncia[]> {
    try {
      const sql = `
        SELECT 
          d.*,
          u.nombre_completo,
          u.correo,
          GROUP_CONCAT(DISTINCT c.nombre_categoria) as categorias,
          GROUP_CONCAT(DISTINCT e.url_archivo) as evidencias,
          COUNT(DISTINCT r.id_reaccion) as likes,
          a.id_visualizador as visualizador_id,
          v.nombre_completo as visualizador_nombre,
          v.organizacion as visualizador_organizacion
        FROM denuncias d
        LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
        LEFT JOIN denuncia_categoria dc ON d.id_denuncia = dc.id_denuncia
        LEFT JOIN categorias c ON dc.id_categoria = c.id_categoria
        LEFT JOIN evidencias e ON d.id_denuncia = e.id_denuncia
        LEFT JOIN reacciones r ON d.id_denuncia = r.id_denuncia
        LEFT JOIN asignaciones a ON d.id_denuncia = a.id_denuncia AND a.fecha_finalizacion IS NULL
        LEFT JOIN usuarios v ON a.id_visualizador = v.id_usuario
        WHERE d.visibilidad_publica = TRUE
        GROUP BY d.id_denuncia, d.id_usuario, d.tipo_denuncia, d.titulo, d.descripcion, 
                 d.ubicacion_direccion, d.ubicacion_lat, d.ubicacion_lng, d.prioridad, 
                 d.estado, d.visibilidad_publica, d.vistas, d.compartidos, 
                 d.fecha_creacion, d.fecha_actualizacion,
                 u.nombre_completo, u.correo, a.id_visualizador, v.nombre_completo, v.organizacion
        ORDER BY d.fecha_creacion DESC
      `
      const results = await query<DenunciaRow[]>(sql)
      return results.map(mapRowToDenuncia)
    } catch (error) {
      console.error("[v0] Error al obtener denuncias públicas:", error)
      return []
    }
  },

  // Obtener denuncias por usuario
  async obtenerPorUsuario(usuarioId: string): Promise<Denuncia[]> {
    try {
      const sql = `
        SELECT 
          d.*,
          u.nombre_completo,
          u.correo,
          GROUP_CONCAT(DISTINCT c.nombre_categoria) as categorias,
          GROUP_CONCAT(DISTINCT e.url_archivo) as evidencias,
          COUNT(DISTINCT r.id_reaccion) as likes,
          a.id_visualizador as visualizador_id,
          v.nombre_completo as visualizador_nombre,
          v.organizacion as visualizador_organizacion
        FROM denuncias d
        LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
        LEFT JOIN denuncia_categoria dc ON d.id_denuncia = dc.id_denuncia
        LEFT JOIN categorias c ON dc.id_categoria = c.id_categoria
        LEFT JOIN evidencias e ON d.id_denuncia = e.id_denuncia
        LEFT JOIN reacciones r ON d.id_denuncia = r.id_denuncia
        LEFT JOIN asignaciones a ON d.id_denuncia = a.id_denuncia AND a.fecha_finalizacion IS NULL
        LEFT JOIN usuarios v ON a.id_visualizador = v.id_usuario
        WHERE d.id_usuario = ?
        GROUP BY d.id_denuncia, d.id_usuario, d.tipo_denuncia, d.titulo, d.descripcion, 
                 d.ubicacion_direccion, d.ubicacion_lat, d.ubicacion_lng, d.prioridad, 
                 d.estado, d.visibilidad_publica, d.vistas, d.compartidos, 
                 d.fecha_creacion, d.fecha_actualizacion,
                 u.nombre_completo, u.correo, a.id_visualizador, v.nombre_completo, v.organizacion
        ORDER BY d.fecha_creacion DESC
      `
      const results = await query<DenunciaRow[]>(sql, [Number.parseInt(usuarioId)])
      return results.map(mapRowToDenuncia)
    } catch (error) {
      console.error("[v0] Error al obtener denuncias del usuario:", error)
      return []
    }
  },

  // Obtener denuncias asignadas a un visualizador
  async obtenerPorVisualizador(visualizadorId: string): Promise<Denuncia[]> {
    try {
      const sql = `
        SELECT 
          d.*,
          u.nombre_completo,
          u.correo,
          GROUP_CONCAT(DISTINCT c.nombre_categoria) as categorias,
          GROUP_CONCAT(DISTINCT e.url_archivo) as evidencias,
          COUNT(DISTINCT r.id_reaccion) as likes,
          a.id_visualizador as visualizador_id,
          v.nombre_completo as visualizador_nombre,
          v.organizacion as visualizador_organizacion
        FROM denuncias d
        INNER JOIN asignaciones a ON d.id_denuncia = a.id_denuncia
        LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
        LEFT JOIN denuncia_categoria dc ON d.id_denuncia = dc.id_denuncia
        LEFT JOIN categorias c ON dc.id_categoria = c.id_categoria
        LEFT JOIN evidencias e ON d.id_denuncia = e.id_denuncia
        LEFT JOIN reacciones r ON d.id_denuncia = r.id_denuncia
        LEFT JOIN usuarios v ON a.id_visualizador = v.id_usuario
        WHERE a.id_visualizador = ? AND a.fecha_finalizacion IS NULL
        GROUP BY d.id_denuncia, d.id_usuario, d.tipo_denuncia, d.titulo, d.descripcion, 
                 d.ubicacion_direccion, d.ubicacion_lat, d.ubicacion_lng, d.prioridad, 
                 d.estado, d.visibilidad_publica, d.vistas, d.compartidos, 
                 d.fecha_creacion, d.fecha_actualizacion,
                 u.nombre_completo, u.correo, a.id_visualizador, v.nombre_completo, v.organizacion
        ORDER BY d.fecha_creacion DESC
      `
      const results = await query<DenunciaRow[]>(sql, [Number.parseInt(visualizadorId)])
      return results.map(mapRowToDenuncia)
    } catch (error) {
      console.error("[v0] Error al obtener denuncias del visualizador:", error)
      return []
    }
  },

  // Crear nueva denuncia
  async crear(denuncia: {
    usuarioId?: string
    tipo: "oficial" | "anonima"
    titulo: string
    descripcion: string
    ubicacion: { lat: number; lng: number; direccion?: string }
    categorias: string[]
    evidencias: string[]
    prioridad: "baja" | "media" | "alta" | "critica"
  }): Promise<string | null> {
    try {
      // Insertar denuncia
      const sqlDenuncia = `
        INSERT INTO denuncias 
        (id_usuario, tipo_denuncia, titulo, descripcion, ubicacion_direccion, ubicacion_lat, ubicacion_lng, prioridad)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      const result: any = await query(sqlDenuncia, [
        denuncia.usuarioId ? Number.parseInt(denuncia.usuarioId) : null,
        denuncia.tipo,
        denuncia.titulo,
        denuncia.descripcion,
        denuncia.ubicacion.direccion || null,
        denuncia.ubicacion.lat,
        denuncia.ubicacion.lng,
        denuncia.prioridad,
      ])

      const denunciaId = result.insertId

      // Insertar categorías (buscar IDs por nombre)
      if (denuncia.categorias.length > 0) {
        const sqlCategorias = `
          INSERT INTO denuncia_categoria (id_denuncia, id_categoria)
          SELECT ?, id_categoria FROM categorias WHERE nombre_categoria IN (?)
        `
        await query(sqlCategorias, [denunciaId, denuncia.categorias])
      }

      // Insertar evidencias
      if (denuncia.evidencias.length > 0) {
        const sqlEvidencias = `
          INSERT INTO evidencias (id_denuncia, tipo, url_archivo, nombre_archivo)
          VALUES ?
        `
        const evidenciasValues = denuncia.evidencias.map((url) => [
          denunciaId,
          url.includes(".mp4") || url.includes(".mov") ? "video" : "imagen",
          url,
          url.split("/").pop(),
        ])
        await query(sqlEvidencias, [evidenciasValues])
      }

      return denunciaId.toString()
    } catch (error) {
      console.error("[v0] Error al crear denuncia:", error)
      return null
    }
  },

  // Actualizar estado de denuncia
  async actualizarEstado(denunciaId: string, nuevoEstado: DenunciaStatus, usuarioId: string): Promise<boolean> {
    try {
      // Obtener estado anterior
      const sqlEstadoAnterior = "SELECT estado FROM denuncias WHERE id_denuncia = ?"
      const resultados = await query<DenunciaRow[]>(sqlEstadoAnterior, [Number.parseInt(denunciaId)])
      const estadoAnterior = resultados[0]?.estado

      // Actualizar estado
      const sqlUpdate = "UPDATE denuncias SET estado = ? WHERE id_denuncia = ?"
      await query(sqlUpdate, [nuevoEstado, Number.parseInt(denunciaId)])

      // Registrar seguimiento
      const sqlSeguimiento = `
        INSERT INTO seguimientos (id_denuncia, id_usuario, comentario, tipo_seguimiento, estado_anterior, estado_nuevo)
        VALUES (?, ?, ?, 'cambio_estado', ?, ?)
      `
      await query(sqlSeguimiento, [
        Number.parseInt(denunciaId),
        Number.parseInt(usuarioId),
        `Estado cambiado de ${estadoAnterior} a ${nuevoEstado}`,
        estadoAnterior,
        nuevoEstado,
      ])

      return true
    } catch (error) {
      console.error("[v0] Error al actualizar estado:", error)
      return false
    }
  },

  // Asignar visualizador a denuncia
  async asignarVisualizador(denunciaId: string, visualizadorId: string): Promise<boolean> {
    try {
      const sql = `
        INSERT INTO asignaciones (id_denuncia, id_visualizador, notas)
        VALUES (?, ?, 'Caso asignado para revisión')
      `
      await query(sql, [Number.parseInt(denunciaId), Number.parseInt(visualizadorId)])

      // Cambiar estado a EN_PROCESO
      await this.actualizarEstado(denunciaId, "EN_PROCESO", visualizadorId)

      return true
    } catch (error) {
      console.error("[v0] Error al asignar visualizador:", error)
      return false
    }
  },

  // Incrementar vistas
  async incrementarVistas(denunciaId: string): Promise<void> {
    try {
      const sql = "UPDATE denuncias SET vistas = vistas + 1 WHERE id_denuncia = ?"
      await query(sql, [Number.parseInt(denunciaId)])
    } catch (error) {
      console.error("[v0] Error al incrementar vistas:", error)
    }
  },

  // Toggle like
  async toggleLike(denunciaId: string, usuarioId: string): Promise<boolean> {
    try {
      // Verificar si ya existe el like
      const sqlCheck = "SELECT * FROM reacciones WHERE id_denuncia = ? AND id_usuario = ?"
      const existing = await query<any[]>(sqlCheck, [Number.parseInt(denunciaId), Number.parseInt(usuarioId)])

      if (existing.length > 0) {
        // Quitar like
        const sqlDelete = "DELETE FROM reacciones WHERE id_denuncia = ? AND id_usuario = ?"
        await query(sqlDelete, [Number.parseInt(denunciaId), Number.parseInt(usuarioId)])
        return false
      } else {
        // Agregar like
        const sqlInsert = "INSERT INTO reacciones (id_denuncia, id_usuario) VALUES (?, ?)"
        await query(sqlInsert, [Number.parseInt(denunciaId), Number.parseInt(usuarioId)])
        return true
      }
    } catch (error) {
      console.error("[v0] Error al toggle like:", error)
      return false
    }
  },
}

// Servicios de Seguimientos/Comentarios
export const seguimientoService = {
  // Obtener seguimientos de una denuncia
  async obtenerPorDenuncia(denunciaId: string): Promise<Comentario[]> {
    try {
      const sql = `
        SELECT s.*, u.nombre_completo, u.tipo_usuario
        FROM seguimientos s
        INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
        WHERE s.id_denuncia = ?
        ORDER BY s.fecha DESC
      `
      const results = await query<any[]>(sql, [Number.parseInt(denunciaId)])

      return results.map((row) => ({
        id: row.id_seguimiento.toString(),
        denunciaId: row.id_denuncia.toString(),
        usuarioId: row.id_usuario.toString(),
        usuarioNombre: row.nombre_completo,
        usuarioRole: mapTipoUsuarioToRole(row.tipo_usuario),
        contenido: row.comentario,
        fechaCreacion: row.fecha.toISOString(),
      }))
    } catch (error) {
      console.error("[v0] Error al obtener seguimientos:", error)
      return []
    }
  },

  // Agregar comentario
  async agregar(denunciaId: string, usuarioId: string, comentario: string): Promise<string | null> {
    try {
      const sql = `
        INSERT INTO seguimientos (id_denuncia, id_usuario, comentario, tipo_seguimiento)
        VALUES (?, ?, ?, 'comentario')
      `
      const result: any = await query(sql, [Number.parseInt(denunciaId), Number.parseInt(usuarioId), comentario])
      return result.insertId.toString()
    } catch (error) {
      console.error("[v0] Error al agregar comentario:", error)
      return null
    }
  },
}

// Servicios de Estadísticas
export const estadisticasService = {
  async obtenerGenerales() {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total_denuncias,
          SUM(CASE WHEN MONTH(fecha_creacion) = MONTH(CURRENT_DATE()) THEN 1 ELSE 0 END) as denuncias_mes,
          SUM(CASE WHEN estado = 'RESUELTA' THEN 1 ELSE 0 END) as denuncias_resueltas,
          SUM(CASE WHEN estado = 'EN_PROCESO' THEN 1 ELSE 0 END) as denuncias_en_proceso,
          (SELECT COUNT(DISTINCT id_usuario) FROM usuarios WHERE activo = TRUE) as usuarios_activos,
          (SELECT COUNT(*) FROM asignaciones WHERE fecha_finalizacion IS NULL) as casos_con_acompanamiento
        FROM denuncias
      `
      const results = await query<any[]>(sql)
      const row = results[0]

      return {
        totalDenuncias: row.total_denuncias,
        denunciasMes: row.denuncias_mes,
        denunciasResueltas: row.denuncias_resueltas,
        denunciasEnProceso: row.denuncias_en_proceso,
        usuariosActivos: row.usuarios_activos,
        porcentajeAcompañamiento:
          row.total_denuncias > 0 ? Math.round((row.casos_con_acompanamiento / row.total_denuncias) * 100) : 0,
      }
    } catch (error) {
      console.error("[v0] Error al obtener estadísticas:", error)
      return {
        totalDenuncias: 0,
        denunciasMes: 0,
        denunciasResueltas: 0,
        denunciasEnProceso: 0,
        usuariosActivos: 0,
        porcentajeAcompañamiento: 0,
      }
    }
  },
}
