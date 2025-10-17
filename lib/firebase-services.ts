import { db, storage, isFirebaseConfigured } from "./firebase-config"
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import type { Denuncia, Comentario } from "@/types"

// Colecciones
const DENUNCIAS_COLLECTION = "denuncias"
const USUARIOS_COLLECTION = "usuarios"
const COMENTARIOS_COLLECTION = "comentarios"

// Servicios de Denuncias
export const denunciaService = {
  // Crear nueva denuncia
  async crear(denuncia: Omit<Denuncia, "id">): Promise<string> {
    if (!isFirebaseConfigured() || !db) {
      console.log("[v0] Firebase no configurado, usando modo simulación")
      return `sim-${Date.now()}`
    }

    try {
      const docRef = await addDoc(collection(db, DENUNCIAS_COLLECTION), {
        ...denuncia,
        fechaCreacion: Timestamp.now(),
        fechaActualizacion: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error("[v0] Error al crear denuncia:", error)
      throw error
    }
  },

  // Obtener todas las denuncias públicas
  async obtenerPublicas(): Promise<Denuncia[]> {
    if (!isFirebaseConfigured() || !db) {
      console.log("[v0] Firebase no configurado, retornando datos mock")
      return []
    }

    try {
      const q = query(
        collection(db, DENUNCIAS_COLLECTION),
        where("visibilidadPublica", "==", true),
        orderBy("fechaCreacion", "desc"),
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Denuncia)
    } catch (error) {
      console.error("[v0] Error al obtener denuncias:", error)
      return []
    }
  },

  // Obtener denuncias por usuario
  async obtenerPorUsuario(usuarioId: string): Promise<Denuncia[]> {
    if (!isFirebaseConfigured() || !db) {
      return []
    }

    try {
      const q = query(
        collection(db, DENUNCIAS_COLLECTION),
        where("denunciante.id", "==", usuarioId),
        orderBy("fechaCreacion", "desc"),
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Denuncia)
    } catch (error) {
      console.error("[v0] Error al obtener denuncias del usuario:", error)
      return []
    }
  },

  // Actualizar estado de denuncia
  async actualizarEstado(denunciaId: string, nuevoEstado: Denuncia["status"]): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      console.log("[v0] Simulando actualización de estado")
      return
    }

    try {
      const denunciaRef = doc(db, DENUNCIAS_COLLECTION, denunciaId)
      await updateDoc(denunciaRef, {
        status: nuevoEstado,
        fechaActualizacion: Timestamp.now(),
      })
    } catch (error) {
      console.error("[v0] Error al actualizar estado:", error)
      throw error
    }
  },

  // Asignar revisor
  async asignarRevisor(denunciaId: string, revisor: Denuncia["revisor"]): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      console.log("[v0] Simulando asignación de revisor")
      return
    }

    try {
      const denunciaRef = doc(db, DENUNCIAS_COLLECTION, denunciaId)
      await updateDoc(denunciaRef, {
        revisor: {
          ...revisor,
          fechaAsignacion: new Date().toISOString(),
        },
        status: "EN_PROCESO",
        fechaActualizacion: Timestamp.now(),
      })
    } catch (error) {
      console.error("[v0] Error al asignar revisor:", error)
      throw error
    }
  },

  // Incrementar vistas
  async incrementarVistas(denunciaId: string): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      return
    }

    try {
      const denunciaRef = doc(db, DENUNCIAS_COLLECTION, denunciaId)
      const denunciaDoc = await getDoc(denunciaRef)
      if (denunciaDoc.exists()) {
        const vistasActuales = denunciaDoc.data().vistas || 0
        await updateDoc(denunciaRef, {
          vistas: vistasActuales + 1,
        })
      }
    } catch (error) {
      console.error("[v0] Error al incrementar vistas:", error)
    }
  },

  // Dar like
  async toggleLike(denunciaId: string, usuarioId: string): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      console.log("[v0] Simulando like")
      return
    }

    try {
      const denunciaRef = doc(db, DENUNCIAS_COLLECTION, denunciaId)
      const denunciaDoc = await getDoc(denunciaRef)

      if (denunciaDoc.exists()) {
        const data = denunciaDoc.data()
        const usuariosLike = data.reacciones?.usuariosLike || []
        const likes = data.reacciones?.likes || 0

        if (usuariosLike.includes(usuarioId)) {
          // Quitar like
          await updateDoc(denunciaRef, {
            "reacciones.likes": likes - 1,
            "reacciones.usuariosLike": usuariosLike.filter((id: string) => id !== usuarioId),
          })
        } else {
          // Agregar like
          await updateDoc(denunciaRef, {
            "reacciones.likes": likes + 1,
            "reacciones.usuariosLike": [...usuariosLike, usuarioId],
          })
        }
      }
    } catch (error) {
      console.error("[v0] Error al dar like:", error)
      throw error
    }
  },
}

// Servicios de Archivos
export const storageService = {
  // Subir archivo
  async subirArchivo(archivo: File, carpeta = "evidencias"): Promise<string> {
    if (!isFirebaseConfigured() || !storage) {
      console.log("[v0] Firebase Storage no configurado, retornando URL simulada")
      return `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(archivo.name)}`
    }

    try {
      const timestamp = Date.now()
      const nombreArchivo = `${carpeta}/${timestamp}_${archivo.name}`
      const storageRef = ref(storage, nombreArchivo)

      await uploadBytes(storageRef, archivo)
      const url = await getDownloadURL(storageRef)
      return url
    } catch (error) {
      console.error("[v0] Error al subir archivo:", error)
      throw error
    }
  },

  // Subir múltiples archivos
  async subirMultiples(archivos: File[], carpeta = "evidencias"): Promise<string[]> {
    const promesas = Array.from(archivos).map((archivo) => this.subirArchivo(archivo, carpeta))
    return Promise.all(promesas)
  },
}

// Servicios de Comentarios
export const comentarioService = {
  // Agregar comentario
  async agregar(comentario: Omit<Comentario, "id">): Promise<string> {
    if (!isFirebaseConfigured() || !db) {
      console.log("[v0] Simulando agregar comentario")
      return `sim-comment-${Date.now()}`
    }

    try {
      const docRef = await addDoc(collection(db, COMENTARIOS_COLLECTION), {
        ...comentario,
        fechaCreacion: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error("[v0] Error al agregar comentario:", error)
      throw error
    }
  },

  // Obtener comentarios de una denuncia
  async obtenerPorDenuncia(denunciaId: string): Promise<Comentario[]> {
    if (!isFirebaseConfigured() || !db) {
      return []
    }

    try {
      const q = query(
        collection(db, COMENTARIOS_COLLECTION),
        where("denunciaId", "==", denunciaId),
        orderBy("fechaCreacion", "desc"),
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Comentario)
    } catch (error) {
      console.error("[v0] Error al obtener comentarios:", error)
      return []
    }
  },
}
