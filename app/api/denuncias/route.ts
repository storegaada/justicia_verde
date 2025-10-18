import { type NextRequest, NextResponse } from "next/server"
import { denunciaService } from "@/lib/db-services"

// GET - Obtener denuncias públicas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const usuarioId = searchParams.get("usuarioId")
    const visualizadorId = searchParams.get("visualizadorId")

    let denuncias
    if (usuarioId) {
      denuncias = await denunciaService.obtenerPorUsuario(usuarioId)
    } else if (visualizadorId) {
      denuncias = await denunciaService.obtenerPorVisualizador(visualizadorId)
    } else {
      denuncias = await denunciaService.obtenerPublicas()
    }

    return NextResponse.json({ denuncias })
  } catch (error) {
    console.error("[v0] Error al obtener denuncias:", error)
    return NextResponse.json({ error: "Error al obtener denuncias" }, { status: 500 })
  }
}

// POST - Crear nueva denuncia
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const denunciaId = await denunciaService.crear({
      usuarioId: body.usuarioId,
      tipo: body.tipo || "oficial",
      titulo: body.titulo,
      descripcion: body.descripcion,
      ubicacion: body.ubicacion,
      categorias: body.categorias || [],
      evidencias: body.evidencias || [],
      prioridad: body.prioridad || "media",
    })

    if (!denunciaId) {
      return NextResponse.json({ error: "Error al crear denuncia" }, { status: 500 })
    }

    return NextResponse.json({ id: denunciaId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error al crear denuncia:", error)
    return NextResponse.json({ error: "Error al crear denuncia" }, { status: 500 })
  }
}
