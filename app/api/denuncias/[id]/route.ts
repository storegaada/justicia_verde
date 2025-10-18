import { type NextRequest, NextResponse } from "next/server"
import { denunciaService } from "@/lib/db-services"

// PATCH - Actualizar estado de denuncia
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { estado, usuarioId } = body

    if (!estado || !usuarioId) {
      return NextResponse.json({ error: "Estado y usuarioId son requeridos" }, { status: 400 })
    }

    const success = await denunciaService.actualizarEstado(params.id, estado, usuarioId)

    if (!success) {
      return NextResponse.json({ error: "Error al actualizar estado" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al actualizar denuncia:", error)
    return NextResponse.json({ error: "Error al actualizar denuncia" }, { status: 500 })
  }
}
