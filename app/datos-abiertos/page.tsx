"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, BarChart3, PieChart } from "lucide-react"
import { mockEstadisticas, mockDenuncias } from "@/lib/mock-data"

export default function DatosAbiertosPage() {
  const denunciasPorTipo = mockDenuncias.reduce(
    (acc, d) => {
      acc[d.tipo] = (acc[d.tipo] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const denunciasPorStatus = mockDenuncias.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const handleExportJSON = () => {
    const data = {
      estadisticas: mockEstadisticas,
      denuncias: mockDenuncias,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "justicia-verde-datos.json"
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-emerald-800 text-3xl">Datos Abiertos</CardTitle>
                  <p className="text-gray-600 mt-2">
                    Estadísticas y reportes públicos sobre denuncias ambientales en Colombia
                  </p>
                </div>
                <Button onClick={handleExportJSON} className="bg-emerald-600 hover:bg-emerald-700">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar JSON
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-emerald-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total denuncias</p>
                    <p className="text-3xl font-bold text-emerald-700">{mockEstadisticas.totalDenuncias}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Este mes</p>
                    <p className="text-3xl font-bold text-emerald-700">{mockEstadisticas.denunciasMes}</p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Resueltas</p>
                    <p className="text-3xl font-bold text-emerald-700">{mockEstadisticas.denunciasResueltas}</p>
                  </div>
                  <PieChart className="h-10 w-10 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Usuarios activos</p>
                    <p className="text-3xl font-bold text-emerald-700">{mockEstadisticas.usuariosActivos}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Denuncias por tipo */}
          <Card className="border-emerald-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-emerald-800">Denuncias por tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(denunciasPorTipo).map(([tipo, cantidad]) => (
                  <div key={tipo} className="flex items-center justify-between">
                    <span className="text-gray-700">{tipo}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${(cantidad / mockDenuncias.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-emerald-700 font-semibold w-8 text-right">{cantidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Denuncias por estado */}
          <Card className="border-emerald-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-emerald-800">Denuncias por estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(denunciasPorStatus).map(([status, cantidad]) => {
                  const labels: Record<string, string> = {
                    RECIBIDA: "Recibidas",
                    EN_PROCESO: "En proceso",
                    RESUELTA: "Resueltas",
                  }
                  const colors: Record<string, string> = {
                    RECIBIDA: "bg-blue-100 text-blue-800",
                    EN_PROCESO: "bg-yellow-100 text-yellow-800",
                    RESUELTA: "bg-green-100 text-green-800",
                  }
                  return (
                    <div key={status} className={`p-4 rounded-lg ${colors[status]}`}>
                      <p className="text-sm font-medium">{labels[status]}</p>
                      <p className="text-3xl font-bold mt-2">{cantidad}</p>
                      <p className="text-xs mt-1">{((cantidad / mockDenuncias.length) * 100).toFixed(1)}% del total</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="border-emerald-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-emerald-800">Sobre estos datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Los datos presentados en esta página son de acceso público y se actualizan en tiempo real. Puedes
                descargarlos en formato JSON para realizar tus propios análisis e investigaciones.
              </p>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-900 mb-2">Uso de los datos</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Investigación académica sobre delitos ambientales</li>
                  <li>• Análisis de tendencias y patrones de contaminación</li>
                  <li>• Desarrollo de políticas públicas ambientales</li>
                  <li>• Periodismo de investigación</li>
                  <li>• Educación y concientización ciudadana</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Nota:</strong> Los datos personales de los denunciantes están protegidos y no se incluyen en las
                exportaciones públicas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
