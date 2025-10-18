"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Map, Users, FileText, Shield, TrendingUp, CheckCircle, Eye, Scale } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Denuncia } from "@/types"

export default function HomePage() {
  const [denunciasRecientes, setDenunciasRecientes] = useState<Denuncia[]>([])
  const [estadisticas, setEstadisticas] = useState({
    totalDenuncias: 0,
    denunciasMes: 0,
    denunciasResueltas: 0,
    denunciasEnProceso: 0,
    usuariosActivos: 0,
    porcentajeAcompañamiento: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargarDatos() {
      try {
        // Cargar denuncias públicas
        const resDenuncias = await fetch("/api/denuncias")
        if (resDenuncias.ok) {
          const denuncias = await resDenuncias.json()
          setDenunciasRecientes(denuncias.slice(0, 3))
        }

        // Cargar estadísticas
        const resEstadisticas = await fetch("/api/estadisticas")
        if (resEstadisticas.ok) {
          const stats = await resEstadisticas.json()
          setEstadisticas(stats)
        }
      } catch (error) {
        console.error("[v0] Error al cargar datos:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-[url('/forest-pattern.jpg')] opacity-10"></div>
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Justicia Verde</h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-50 text-pretty">
              Plataforma ciudadana para denunciar, visibilizar y combatir delitos ambientales en Colombia
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/denuncia">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Hacer una denuncia
                </Button>
              </Link>
              <Link href="/mapa">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-emerald-800 text-lg px-8 bg-transparent"
                >
                  <Map className="mr-2 h-5 w-5" />
                  Ver mapa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="h-12 w-12 text-emerald-600" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-700">{estadisticas.denunciasMes}</div>
                  <div className="text-sm text-gray-600">este mes</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Denuncias recibidas</h3>
              <p className="text-sm text-gray-600 mt-2">Total histórico: {estadisticas.totalDenuncias} denuncias</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Scale className="h-12 w-12 text-emerald-600" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-700">{estadisticas.porcentajeAcompañamiento}%</div>
                  <div className="text-sm text-gray-600">con apoyo</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Acompañamiento legal</h3>
              <p className="text-sm text-gray-600 mt-2">
                {estadisticas.denunciasResueltas} casos resueltos exitosamente
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-12 w-12 text-emerald-600" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-700">
                    {estadisticas.usuariosActivos.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">usuarios</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Comunidad activa</h3>
              <p className="text-sm text-gray-600 mt-2">Ciudadanos comprometidos con el medio ambiente</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-2">Denuncias recientes</h2>
            <p className="text-gray-600">Conoce los casos más recientes reportados por la comunidad</p>
          </div>
          <Link href="/cuenta">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Ver todas las denuncias</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {denunciasRecientes.map((denuncia) => {
            const statusLabels: Record<string, string> = {
              RECIBIDA: "Recibida",
              EN_PROCESO: "En proceso",
              RESUELTA: "Resuelta",
              RECHAZADA: "Rechazada",
            }

            const statusColors: Record<string, string> = {
              RECIBIDA: "bg-blue-100 text-blue-800",
              EN_PROCESO: "bg-yellow-100 text-yellow-800",
              RESUELTA: "bg-green-100 text-green-800",
              RECHAZADA: "bg-red-100 text-red-800",
            }

            const prioridadColors: Record<string, string> = {
              baja: "bg-green-100 text-green-800",
              media: "bg-yellow-100 text-yellow-800",
              alta: "bg-orange-100 text-orange-800",
              critica: "bg-red-100 text-red-800",
            }

            return (
              <Card key={denuncia.id} className="border-emerald-200 shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  {denuncia.evidencias[0] && (
                    <img
                      src={denuncia.evidencias[0] || "/placeholder.svg"}
                      alt={denuncia.titulo}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {denuncia.tipo}
                    </Badge>
                    <Badge className={`${prioridadColors[denuncia.prioridad]} text-xs`}>
                      {denuncia.prioridad.toUpperCase()}
                    </Badge>
                    <Badge className={`${statusColors[denuncia.status]} text-xs`}>
                      {statusLabels[denuncia.status]}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{denuncia.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{denuncia.descripcion}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {denuncia.vistas}
                    </span>
                    <span className="flex items-center gap-1">❤️ {denuncia.reacciones.likes}</span>
                    <span className="flex items-center gap-1">💬 {denuncia.comentarios.length}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">📍 {denuncia.ubicacion.direccion}</p>
                    <Link href="/cuenta">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                      >
                        Inicia sesión para ver más detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
          <p className="text-emerald-900 font-semibold mb-2">
            ¿Quieres ver todas las denuncias y participar en la comunidad?
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Inicia sesión para acceder al mapa completo, comentar, reaccionar y seguir el progreso de los casos
          </p>
          <Link href="/cuenta">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Iniciar sesión o registrarse</Button>
          </Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-emerald-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-900">
            Cómo presentar una denuncia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Identifica el daño",
                description: "Lugar, tiempo y actores si es posible",
                icon: Eye,
              },
              {
                step: "2",
                title: "Reúne evidencia",
                description: "Fotos, videos y coordenadas",
                icon: FileText,
              },
              {
                step: "3",
                title: "Envía la denuncia",
                description: "Oficial o anónima",
                icon: AlertTriangle,
              },
              {
                step: "4",
                title: "Consulta progreso",
                description: "En Mis Denuncias (si estás registrado)",
                icon: CheckCircle,
              },
            ].map((item) => (
              <Card key={item.step} className="border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <item.icon className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/denuncia">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Hacer Denuncia
              </Button>
            </Link>
            <div className="mt-4 flex items-center justify-center gap-4">
              <Link href="/mapa">
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                >
                  <Map className="mr-2 h-4 w-4" />
                  Ver Mapa
                </Button>
              </Link>
              <Link href="/contactos">
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Mis Denuncias
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-900">Nuestra plataforma</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Map,
              title: "Mapa interactivo",
              description: "Visualiza denuncias en tiempo real y conoce los puntos críticos ambientales en Colombia",
            },
            {
              icon: Shield,
              title: "Validación de reportes",
              description: "Sistema de verificación para garantizar la veracidad de las denuncias",
            },
            {
              icon: Scale,
              title: "Apoyo legal y social",
              description: "Conexión directa con organizaciones especializadas en derecho ambiental",
            },
            {
              icon: TrendingUp,
              title: "Datos abiertos",
              description: "Acceso público a estadísticas y reportes descargables para investigación",
            },
            {
              icon: Users,
              title: "Comunidad activa",
              description: "Red de ciudadanos comprometidos con la protección del medio ambiente",
            },
            {
              icon: CheckCircle,
              title: "Seguimiento de casos",
              description: "Monitorea el progreso de tu denuncia desde recepción hasta resolución",
            },
          ].map((feature, index) => (
            <Card key={index} className="border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <feature.icon className="h-12 w-12 text-emerald-600 mb-4" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Únete a la lucha por un Colombia más verde</h2>
          <p className="text-xl mb-8 text-emerald-50 max-w-2xl mx-auto">
            Cada denuncia cuenta. Juntos podemos hacer la diferencia en la protección de nuestro medio ambiente.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/denuncia">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8">
                Hacer una denuncia ahora
              </Button>
            </Link>
            <Link href="/cuenta?tab=registro">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-emerald-800 text-lg px-8 bg-transparent"
              >
                Crear cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
