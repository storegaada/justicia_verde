import { type NextRequest, NextResponse } from "next/server"
import { denunciaService } from "@/lib/db-services"

// POST - Asignar visualizador a denuncia
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { visualizadorId } = body

    if (!visualizadorId) {
      return NextResponse.json({ error: "visualizadorId es requerido" }, { status: 400 })
    }

    const success = await denunciaService.asignarVisualizador(params.id, visualizadorId)

    if (!success) {
      return NextResponse.json({ error: "Error al asignar visualizador" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al asignar visualizador:", error)
    return NextResponse.json({ error: "Error al asignar visualizador" }, { status: 500 })
  }
}
