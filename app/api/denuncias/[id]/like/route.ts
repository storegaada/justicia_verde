import { type NextRequest, NextResponse } from "next/server"
import { denunciaService } from "@/lib/db-services"

// POST - Toggle like en denuncia
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { usuarioId } = body

    if (!usuarioId) {
      return NextResponse.json({ error: "usuarioId es requerido" }, { status: 400 })
    }

    const liked = await denunciaService.toggleLike(params.id, usuarioId)

    return NextResponse.json({ liked })
  } catch (error) {
    console.error("[v0] Error al dar like:", error)
    return NextResponse.json({ error: "Error al dar like" }, { status: 500 })
  }
}
