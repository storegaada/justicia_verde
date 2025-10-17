"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockDenuncias } from "@/lib/mock-data"
import { FileText, Clock, CheckCircle, AlertTriangle, MessageCircle, Eye, UserCheck } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function RevisorPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/cuenta")
    } else if (user?.role !== "revisor") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "revisor") {
    return null
  }

  const currentRevisor = user

  const denunciasDisponibles = mockDenuncias.filter((d) => d.status === "RECIBIDA" && !d.revisor)

  const misDenunciasEnProceso = mockDenuncias.filter(
    (d) => d.status === "EN_PROCESO" && d.revisor?.id === currentRevisor.id,
  )

  const misDenunciasResueltas = mockDenuncias.filter(
    (d) => d.status === "RESUELTA" && d.revisor?.id === currentRevisor.id,
  )

  const todasMisDenuncias = mockDenuncias.filter((d) => d.revisor?.id === currentRevisor.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">Panel de Visualizador (Revisor)</h1>
        <p className="text-gray-600">Gestiona y resuelve denuncias ambientales</p>
      </div>

      {/* Perfil del revisor */}
      <Card className="mb-8 border-emerald-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <img
              src={currentRevisor.avatar || "/placeholder.svg"}
              alt={currentRevisor.nombre}
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-emerald-900">{currentRevisor.nombre}</h2>
              <p className="text-gray-600">{currentRevisor.organizacion}</p>
              <p className="text-sm text-gray-500">{currentRevisor.especialidad}</p>
              <div className="flex gap-4 mt-2">
                <Badge variant="outline" className="bg-yellow-50">
                  <Clock className="h-3 w-3 mr-1" />
                  {currentRevisor.denunciasEnRevision} en revisión
                </Badge>
                <Badge variant="outline" className="bg-green-50">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {currentRevisor.denunciasResueltas} resueltas
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-10 w-10 text-blue-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-700">{denunciasDisponibles.length}</div>
                <div className="text-xs text-gray-600">Disponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Clock className="h-10 w-10 text-yellow-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-700">{misDenunciasEnProceso.length}</div>
                <div className="text-xs text-gray-600">En proceso</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-10 w-10 text-green-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">{misDenunciasResueltas.length}</div>
                <div className="text-xs text-gray-600">Resueltas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <FileText className="h-10 w-10 text-emerald-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-700">{todasMisDenuncias.length}</div>
                <div className="text-xs text-gray-600">Total casos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de denuncias */}
      <Tabs defaultValue="disponibles" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="disponibles">Disponibles ({denunciasDisponibles.length})</TabsTrigger>
          <TabsTrigger value="enproceso">En proceso ({misDenunciasEnProceso.length})</TabsTrigger>
          <TabsTrigger value="resueltas">Resueltas ({misDenunciasResueltas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="disponibles" className="mt-6">
          <div className="space-y-4">
            {denunciasDisponibles.map((denuncia) => (
              <Card key={denuncia.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{denuncia.titulo}</h3>
                      <div className="flex gap-2 flex-wrap mb-3">
                        <Badge variant="outline">{denuncia.tipo}</Badge>
                        <Badge
                          className={
                            denuncia.prioridad === "critica"
                              ? "bg-red-100 text-red-800"
                              : denuncia.prioridad === "alta"
                                ? "bg-orange-100 text-orange-800"
                                : denuncia.prioridad === "media"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                          }
                        >
                          {denuncia.prioridad.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{denuncia.descripcion}</p>
                      <div className="flex gap-4 text-xs text-gray-500 mb-3">
                        <span>📍 {denuncia.ubicacion.direccion}</span>
                        <span>📅 {new Date(denuncia.fechaCreacion).toLocaleDateString("es-CO")}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>❤️ {denuncia.reacciones.likes} likes</span>
                        <span>💬 {denuncia.comentarios.length} comentarios</span>
                        <span>👁️ {denuncia.vistas} vistas</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Tomar caso
                      </Button>
                      <Link href={`/mapa`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enproceso" className="mt-6">
          <div className="space-y-4">
            {misDenunciasEnProceso.map((denuncia) => (
              <Card key={denuncia.id} className="border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{denuncia.titulo}</h3>
                      <div className="flex gap-2 flex-wrap mb-3">
                        <Badge variant="outline">{denuncia.tipo}</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">EN PROCESO</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{denuncia.descripcion}</p>
                      <div className="flex gap-4 text-xs text-gray-500 mb-3">
                        <span>📍 {denuncia.ubicacion.direccion}</span>
                        <span>
                          📅 Asignado:{" "}
                          {denuncia.revisor?.fechaAsignacion
                            ? new Date(denuncia.revisor.fechaAsignacion).toLocaleDateString("es-CO")
                            : "N/A"}
                        </span>
                      </div>
                      {denuncia.comentarios.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded text-sm mb-3">
                          <p className="font-semibold mb-1">Último comentario:</p>
                          <p className="text-gray-600">
                            {denuncia.comentarios[denuncia.comentarios.length - 1].contenido}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar resuelta
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comentar
                      </Button>
                      <Link href={`/mapa`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resueltas" className="mt-6">
          <div className="space-y-4">
            {misDenunciasResueltas.map((denuncia) => (
              <Card key={denuncia.id} className="border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{denuncia.titulo}</h3>
                      <div className="flex gap-2 flex-wrap mb-3">
                        <Badge variant="outline">{denuncia.tipo}</Badge>
                        <Badge className="bg-green-100 text-green-800">RESUELTA</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{denuncia.descripcion}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>📍 {denuncia.ubicacion.direccion}</span>
                        <span>✅ Resuelta: {new Date(denuncia.fechaActualizacion).toLocaleDateString("es-CO")}</span>
                      </div>
                    </div>
                    <Link href={`/mapa`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
