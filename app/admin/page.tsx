"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockDenuncias, mockUsers, mockEstadisticas } from "@/lib/mock-data"
import { Users, FileText, CheckCircle, Clock, Download, Eye, Trash2, UserCheck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todas")
  const [filterPrioridad, setFilterPrioridad] = useState("todas")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/cuenta")
    } else if (user?.role !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const denunciasFiltradas = mockDenuncias.filter((denuncia) => {
    const matchSearch =
      denuncia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === "todas" || denuncia.status === filterStatus
    const matchPrioridad = filterPrioridad === "todas" || denuncia.prioridad === filterPrioridad
    return matchSearch && matchStatus && matchPrioridad
  })

  const revisores = mockUsers.filter((u) => u.role === "revisor")
  const demandantes = mockUsers.filter((u) => u.role === "demandante")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Bienvenido, {user.nombre} - Gestión completa de la plataforma</p>
        </div>
        <div className="flex items-center gap-3">
          <img src={user.avatar || "/placeholder.svg"} alt={user.nombre} className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-semibold text-sm">{user.nombre}</p>
            <Badge className="bg-purple-100 text-purple-800">Administrador</Badge>
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <FileText className="h-10 w-10 text-emerald-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-700">{mockEstadisticas.totalDenuncias}</div>
                <div className="text-xs text-gray-600">Total denuncias</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Users className="h-10 w-10 text-blue-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-700">{mockEstadisticas.usuariosActivos}</div>
                <div className="text-xs text-gray-600">Usuarios activos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-10 w-10 text-green-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">{mockEstadisticas.denunciasResueltas}</div>
                <div className="text-xs text-gray-600">Casos resueltos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Clock className="h-10 w-10 text-yellow-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-700">{mockEstadisticas.denunciasEnProceso}</div>
                <div className="text-xs text-gray-600">En proceso</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestión de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Revisores activos ({revisores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revisores.map((revisor) => (
                <div key={revisor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <img
                      src={revisor.avatar || "/placeholder.svg"}
                      alt={revisor.nombre}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-sm">{revisor.nombre}</p>
                      <p className="text-xs text-gray-600">{revisor.organizacion}</p>
                      <p className="text-xs text-gray-500">{revisor.especialidad}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">{revisor.denunciasEnRevision} activas</p>
                    <p className="text-xs text-gray-500">{revisor.denunciasResueltas} resueltas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Demandantes activos ({demandantes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demandantes.map((demandante) => (
                <div key={demandante.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <img
                      src={demandante.avatar || "/placeholder.svg"}
                      alt={demandante.nombre}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-sm">{demandante.nombre}</p>
                      <p className="text-xs text-gray-600">{demandante.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">{demandante.denunciasCreadas} denuncias</p>
                    <p className="text-xs text-gray-500">
                      Desde {new Date(demandante.fechaRegistro).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestión de denuncias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gestión de denuncias
            </span>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar todo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar denuncias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos los estados</SelectItem>
                <SelectItem value="RECIBIDA">Recibida</SelectItem>
                <SelectItem value="EN_PROCESO">En proceso</SelectItem>
                <SelectItem value="RESUELTA">Resuelta</SelectItem>
                <SelectItem value="RECHAZADA">Rechazada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPrioridad} onValueChange={setFilterPrioridad}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las prioridades</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de denuncias */}
          <div className="space-y-4">
            {denunciasFiltradas.map((denuncia) => (
              <div key={denuncia.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{denuncia.titulo}</h3>
                    <div className="flex gap-2 flex-wrap mb-2">
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
                      <Badge
                        className={
                          denuncia.status === "RESUELTA"
                            ? "bg-green-100 text-green-800"
                            : denuncia.status === "EN_PROCESO"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {denuncia.status === "RECIBIDA"
                          ? "Recibida"
                          : denuncia.status === "EN_PROCESO"
                            ? "En proceso"
                            : "Resuelta"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{denuncia.descripcion.substring(0, 150)}...</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>❤️ {denuncia.reacciones.likes} likes</span>
                      <span>💬 {denuncia.comentarios.length} comentarios</span>
                      <span>👁️ {denuncia.vistas} vistas</span>
                      <span>📅 {new Date(denuncia.fechaCreacion).toLocaleDateString("es-CO")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                {denuncia.revisor && (
                  <div className="bg-emerald-50 p-2 rounded text-xs">
                    <span className="font-semibold">Revisor:</span> {denuncia.revisor.nombre} (
                    {denuncia.revisor.organizacion})
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
