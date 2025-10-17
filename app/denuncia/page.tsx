"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInfo } from "@/components/sidebar-info"
import { MapPin, Upload, Loader2, CheckCircle } from "lucide-react"
import type { TipoDenuncia } from "@/types"
import dynamic from "next/dynamic"
import { denunciaService, storageService } from "@/lib/firebase-services"
import { useAuth } from "@/lib/auth-context"

const MapaInteractivo = dynamic(() => import("@/components/mapa-interactivo").then((mod) => mod.MapaInteractivo), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  ),
})

export default function DenunciaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [tipo, setTipo] = useState<TipoDenuncia>("Deforestación")
  const [titulo, setTitulo] = useState("")
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const [lat, setLat] = useState("4.7110")
  const [lng, setLng] = useState("-74.0721")
  const [archivos, setArchivos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const tiposDenuncia: TipoDenuncia[] = [
    "Deforestación",
    "Contaminación hídrica",
    "Contaminación del aire",
    "Minería ilegal",
    "Tráfico de fauna",
    "Quema de bosques",
    "Vertimiento de residuos",
    "Otro",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let urlsEvidencias: string[] = []
      if (archivos.length > 0) {
        console.log("[v0] Subiendo archivos...")
        urlsEvidencias = await storageService.subirMultiples(archivos)
      }

      const nuevaDenuncia = {
        tipo,
        titulo: titulo || `Denuncia de ${tipo}`,
        descripcion,
        ubicacion: {
          lat: Number.parseFloat(lat),
          lng: Number.parseFloat(lng),
          direccion: ubicacion || "Ubicación no especificada",
        },
        evidencias: urlsEvidencias,
        denunciante: {
          id: user?.id,
          nombre: nombre || "Anónimo",
          email: user?.email,
          anonimo: !nombre,
        },
        status: "RECIBIDA" as const,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        prioridad: "media" as const,
        visibilidadPublica: true,
        reacciones: {
          likes: 0,
          usuariosLike: [],
        },
        comentarios: [],
        vistas: 0,
        compartidos: 0,
      }

      console.log("[v0] Creando denuncia:", nuevaDenuncia)
      const denunciaId = await denunciaService.crear(nuevaDenuncia)
      console.log("[v0] Denuncia creada con ID:", denunciaId)

      setSuccess(true)

      setTimeout(() => {
        if (user?.role === "demandante") {
          router.push("/mis-denuncias")
        } else {
          router.push("/mapa")
        }
      }, 2000)
    } catch (error) {
      console.error("[v0] Error al crear denuncia:", error)
      alert("Error al crear la denuncia. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toFixed(4))
          setLng(position.coords.longitude.toFixed(4))
          alert("Ubicación obtenida exitosamente")
        },
        () => {
          alert("No se pudo obtener la ubicación")
        },
      )
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos(Array.from(e.target.files))
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md border-emerald-200 shadow-lg">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">¡Denuncia enviada!</h2>
            <p className="text-gray-600 mb-4">Tu denuncia ha sido registrada exitosamente y será revisada pronto.</p>
            <p className="text-sm text-gray-500">Redirigiendo...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-800 text-2xl">Crear denuncia</CardTitle>
                <p className="text-sm text-gray-600">
                  Completa el formulario para reportar un delito ambiental. Tu denuncia será visible públicamente.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de denuncia *</Label>
                      <Select value={tipo} onValueChange={(value) => setTipo(value as TipoDenuncia)}>
                        <SelectTrigger id="tipo" className="border-emerald-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDenuncia.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nombre">Tu nombre (opcional)</Label>
                      <Input
                        id="nombre"
                        placeholder="Anónimo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="border-emerald-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título de la denuncia</Label>
                    <Input
                      id="titulo"
                      placeholder="Ej: Tala ilegal en el Parque Nacional"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="border-emerald-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción *</Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Cuenta qué ocurrió, cuándo y quiénes podrían estar implicados."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      rows={5}
                      className="border-emerald-300"
                      required
                    />
                    <p className="text-sm text-gray-600">
                      Cuenta qué ocurrió, cuándo y quiénes podrían estar implicados.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Evidencia (fotos, videos)</Label>
                    <div className="flex gap-2 items-center">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-emerald-300 text-emerald-700 bg-transparent"
                        onClick={() => document.getElementById("fileInput")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Elegir archivos
                      </Button>
                      <span className="text-sm text-gray-600">
                        {archivos.length > 0 ? `${archivos.length} archivo(s) seleccionado(s)` : "Sin archivos"}
                      </span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="fileInput"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ubicacion"
                        placeholder="Ej: Parque Central Bogotá"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        className="border-emerald-300"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleUseLocation}
                        className="border-emerald-300 text-emerald-700 bg-transparent whitespace-nowrap"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Mi ubicación
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lat">Latitud *</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="0.0001"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        className="border-emerald-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng">Longitud *</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="0.0001"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        className="border-emerald-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="h-64 rounded-lg overflow-hidden border-2 border-emerald-300">
                    <MapaInteractivo
                      denuncias={[]}
                      center={[Number.parseFloat(lat) || 4.711, Number.parseFloat(lng) || -74.0721]}
                      zoom={12}
                      height="100%"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar denuncia"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 bg-transparent"
                      onClick={() => router.back()}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <SidebarInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
