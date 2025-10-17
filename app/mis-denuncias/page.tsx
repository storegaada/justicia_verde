"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInfo } from "@/components/sidebar-info"
import { mockDenuncias } from "@/lib/mock-data"
import type { DenunciaStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function MisDenunciasPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [filtro, setFiltro] = useState<"Todas" | DenunciaStatus>("Todas")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/cuenta")
    } else if (user?.role !== "demandante") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "demandante") {
    return null
  }

  const misDenuncias = mockDenuncias.filter((d) => d.denunciante.id === user.id)
  const denunciasFiltradas = filtro === "Todas" ? misDenuncias : misDenuncias.filter((d) => d.status === filtro)

  const statusLabels: Record<DenunciaStatus, string> = {
    RECIBIDA: "Recibida",
    EN_PROCESO: "En proceso",
    RESUELTA: "Resuelta",
    RECHAZADA: "Rechazada",
  }

  const statusColors: Record<DenunciaStatus, string> = {
    RECIBIDA: "bg-blue-100 text-blue-800",
    EN_PROCESO: "bg-yellow-100 text-yellow-800",
    RESUELTA: "bg-green-100 text-green-800",
    RECHAZADA: "bg-red-100 text-red-800",
  }

  const prioridadColors: Record<string, string> = {
    baja: "bg-gray-100 text-gray-800",
    media: "bg-orange-100 text-orange-800",
    alta: "bg-red-100 text-red-800",
    critica: "bg-red-200 text-red-900",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-emerald-800 text-2xl">Mis denuncias</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Bienvenido, {user.nombre}</p>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filtro} onValueChange={(value) => setFiltro(value as any)}>
                      <SelectTrigger className="w-[180px] border-emerald-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todas">Todas</SelectItem>
                        <SelectItem value="RECIBIDA">Recibida</SelectItem>
                        <SelectItem value="EN_PROCESO">En proceso</SelectItem>
                        <SelectItem value="RESUELTA">Resuelta</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="border-emerald-300 text-emerald-700 bg-transparent">
                      Exportar JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{misDenuncias.length}</div>
                    <div className="text-xs text-gray-600">Total denuncias</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-700">
                      {misDenuncias.filter((d) => d.status === "EN_PROCESO").length}
                    </div>
                    <div className="text-xs text-gray-600">En proceso</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {misDenuncias.filter((d) => d.status === "RESUELTA").length}
                    </div>
                    <div className="text-xs text-gray-600">Resueltas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {denunciasFiltradas.length === 0 ? (
                <Card className="border-emerald-200">
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-600">No tienes denuncias con este filtro.</p>
                  </CardContent>
                </Card>
              ) : (
                denunciasFiltradas.map((denuncia) => (
                  <Card key={denuncia.id} className="border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <AlertCircle className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{denuncia.titulo}</h3>
                              <p className="text-sm text-gray-600 mt-1">{denuncia.descripcion}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={statusColors[denuncia.status]}>{statusLabels[denuncia.status]}</Badge>
                            <Badge className={prioridadColors[denuncia.prioridad]}>
                              Prioridad: {denuncia.prioridad}
                            </Badge>
                            <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                              {denuncia.tipo}
                            </Badge>
                          </div>

                          <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {denuncia.ubicacion.direccion || `${denuncia.ubicacion.lat}, ${denuncia.ubicacion.lng}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(denuncia.fechaCreacion).toLocaleDateString("es-CO")}</span>
                            </div>
                          </div>

                          {denuncia.revisor && (
                            <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                              <p className="text-sm font-medium text-emerald-900">
                                Revisor asignado: {denuncia.revisor.nombre}
                              </p>
                              <p className="text-xs text-emerald-700">{denuncia.revisor.organizacion}</p>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div>
            <SidebarInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
