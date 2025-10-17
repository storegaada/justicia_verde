export type UserRole = "admin" | "demandante" | "revisor"

export type DenunciaStatus = "RECIBIDA" | "EN_PROCESO" | "RESUELTA" | "RECHAZADA"

export type TipoDenuncia =
  | "Deforestación"
  | "Contaminación hídrica"
  | "Contaminación del aire"
  | "Minería ilegal"
  | "Tráfico de fauna"
  | "Quema de bosques"
  | "Vertimiento de residuos"
  | "Otro"

export interface Denuncia {
  id: string
  tipo: TipoDenuncia
  titulo: string
  descripcion: string
  ubicacion: {
    lat: number
    lng: number
    direccion?: string
  }
  evidencias: string[]
  denunciante?: {
    id?: string
    nombre?: string
    email?: string
    anonimo: boolean
  }
  status: DenunciaStatus
  fechaCreacion: string
  fechaActualizacion: string
  revisor?: {
    id: string
    nombre: string
    organizacion: string
    fechaAsignacion?: string
  }
  prioridad: "baja" | "media" | "alta" | "critica"
  visibilidadPublica: boolean
  reacciones: {
    likes: number
    usuariosLike: string[]
  }
  comentarios: Comentario[]
  vistas: number
  compartidos: number
}

export interface Comentario {
  id: string
  denunciaId: string
  usuarioId: string
  usuarioNombre: string
  usuarioRole: UserRole
  contenido: string
  fechaCreacion: string
  respuestas?: Comentario[]
}

export interface User {
  id: string
  nombre: string
  email: string
  role: UserRole
  organizacion?: string
  denunciasCreadas?: number
  denunciasResueltas?: number
  denunciasEnRevision?: number
  especialidad?: string
  telefono?: string
  avatar?: string
  fechaRegistro: string
  activo: boolean
}

export interface Estadisticas {
  totalDenuncias: number
  denunciasMes: number
  denunciasResueltas: number
  denunciasEnProceso: number
  usuariosActivos: number
  porcentajeAcompañamiento: number
}
