import { type NextRequest, NextResponse } from "next/server"
import { seguimientoService } from "@/lib/db-services"

// GET - Obtener seguimientos de una denuncia
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const denunciaId = searchParams.get("denunciaId")

    if (!denunciaId) {
      return NextResponse.json({ error: "denunciaId es requerido" }, { status: 400 })
    }

    const seguimientos = await seguimientoService.obtenerPorDenuncia(denunciaId)

    return NextResponse.json({ seguimientos })
  } catch (error) {
    console.error("[v0] Error al obtener seguimientos:", error)
    return NextResponse.json({ error: "Error al obtener seguimientos" }, { status: 500 })
  }
}

// POST - Agregar comentario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { denunciaId, usuarioId, comentario } = body

    if (!denunciaId || !usuarioId || !comentario) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const id = await seguimientoService.agregar(denunciaId, usuarioId, comentario)

    if (!id) {
      return NextResponse.json({ error: "Error al agregar comentario" }, { status: 500 })
    }

    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error al agregar comentario:", error)
    return NextResponse.json({ error: "Error al agregar comentario" }, { status: 500 })
  }
}
