import { NextResponse } from "next/server"
import { estadisticasService } from "@/lib/db-services"

// GET - Obtener estadísticas generales
export async function GET() {
  try {
    const estadisticas = await estadisticasService.obtenerGenerales()
    return NextResponse.json({ estadisticas })
  } catch (error) {
    console.error("[v0] Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
