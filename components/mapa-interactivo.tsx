"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Denuncia } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Eye, X } from "lucide-react"

interface MapaInteractivoProps {
  denuncias: Denuncia[]
  center?: [number, number]
  zoom?: number
  onMarkerClick?: (denuncia: Denuncia) => void
  height?: string
}

export function MapaInteractivo({
  denuncias,
  center = [4.5709, -74.2973],
  zoom = 6,
  onMarkerClick,
  height = "600px",
}: MapaInteractivoProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null)

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    if (!mapContainerRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    })
    mapRef.current = map

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    const getIcon = (prioridad: string, tipo: string) => {
      const colors: Record<string, string> = {
        baja: "#10b981",
        media: "#f59e0b",
        alta: "#ef4444",
        critica: "#7f1d1d",
      }

      const icons: Record<string, string> = {
        Deforestación: "🌳",
        "Contaminación hídrica": "💧",
        "Contaminación del aire": "💨",
        "Minería ilegal": "⛏️",
        "Tráfico de fauna": "🦜",
        "Quema de bosques": "🔥",
        "Vertimiento de residuos": "🗑️",
        Otro: "⚠️",
      }

      return L.divIcon({
        className: "custom-marker",
        html: `
          <div style="position: relative;">
            <div style="
              background-color: ${colors[prioridad] || colors.media}; 
              width: 36px; 
              height: 36px; 
              border-radius: 50%; 
              border: 3px solid white; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              cursor: pointer;
            ">
              ${icons[tipo] || icons.Otro}
            </div>
            <div style="
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid ${colors[prioridad] || colors.media};
            "></div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
      })
    }

    denuncias.forEach((denuncia) => {
      const marker = L.marker([denuncia.ubicacion.lat, denuncia.ubicacion.lng], {
        icon: getIcon(denuncia.prioridad, denuncia.tipo),
      }).addTo(map)

      const statusLabels: Record<string, string> = {
        RECIBIDA: "Recibida",
        EN_PROCESO: "En proceso",
        RESUELTA: "Resuelta",
        RECHAZADA: "Rechazada",
      }

      const prioridadColors: Record<string, string> = {
        baja: "#10b981",
        media: "#f59e0b",
        alta: "#ef4444",
        critica: "#7f1d1d",
      }

      marker.bindPopup(
        `
        <div style="min-width: 280px; max-width: 320px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="font-weight: 600; margin-bottom: 10px; color: #065f46; font-size: 16px; line-height: 1.3;">${denuncia.titulo}</h3>
          <div style="display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap;">
            <span style="background: #d1fae5; color: #065f46; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">${denuncia.tipo}</span>
            <span style="background: ${prioridadColors[denuncia.prioridad]}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">${denuncia.prioridad.toUpperCase()}</span>
            <span style="background: #e5e7eb; color: #374151; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">${statusLabels[denuncia.status]}</span>
          </div>
          <p style="font-size: 13px; color: #374151; margin-bottom: 12px; line-height: 1.5;">${denuncia.descripcion.substring(0, 150)}...</p>
          <div style="display: flex; gap: 16px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 10px;">
            <span style="display: flex; align-items: center; gap: 4px;">❤️ ${denuncia.reacciones.likes}</span>
            <span style="display: flex; align-items: center; gap: 4px;">💬 ${denuncia.comentarios.length}</span>
            <span style="display: flex; align-items: center; gap: 4px;">👁️ ${denuncia.vistas}</span>
          </div>
          <button 
            onclick="window.dispatchEvent(new CustomEvent('denunciaClick', { detail: '${denuncia.id}' }))"
            style="
              width: 100%;
              margin-top: 12px;
              padding: 8px;
              background: #059669;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 500;
              cursor: pointer;
            "
          >
            Ver detalles completos
          </button>
        </div>
      `,
        {
          maxWidth: 320,
          className: "custom-popup",
        },
      )

      marker.on("click", () => {
        setSelectedDenuncia(denuncia)
        if (onMarkerClick) {
          onMarkerClick(denuncia)
        }
      })
    })

    const handleDenunciaClick = (e: CustomEvent) => {
      const denunciaId = e.detail
      const denuncia = denuncias.find((d) => d.id === denunciaId)
      if (denuncia) {
        setSelectedDenuncia(denuncia)
        if (onMarkerClick) {
          onMarkerClick(denuncia)
        }
      }
    }

    window.addEventListener("denunciaClick", handleDenunciaClick as EventListener)

    return () => {
      window.removeEventListener("denunciaClick", handleDenunciaClick as EventListener)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [denuncias, center, zoom, onMarkerClick])

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
    <div className="relative">
      <div ref={mapContainerRef} style={{ height, width: "100%", borderRadius: "8px" }} />

      {selectedDenuncia && (
        <Card className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] overflow-y-auto shadow-2xl z-[1000] bg-white">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setSelectedDenuncia(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg pr-8">{selectedDenuncia.titulo}</CardTitle>
            <div className="flex gap-2 flex-wrap mt-2">
              <Badge variant="outline">{selectedDenuncia.tipo}</Badge>
              <Badge className={prioridadColors[selectedDenuncia.prioridad]}>
                {selectedDenuncia.prioridad.toUpperCase()}
              </Badge>
              <Badge className={statusColors[selectedDenuncia.status]}>{statusLabels[selectedDenuncia.status]}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Descripción</h4>
              <p className="text-sm text-gray-600">{selectedDenuncia.descripcion}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Ubicación</h4>
              <p className="text-sm text-gray-600">{selectedDenuncia.ubicacion.direccion}</p>
            </div>

            {selectedDenuncia.evidencias.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Evidencias</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDenuncia.evidencias.map((evidencia, idx) => (
                    <img
                      key={idx}
                      src={evidencia || "/placeholder.svg"}
                      alt={`Evidencia ${idx + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedDenuncia.revisor && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Revisor asignado</h4>
                <p className="text-sm text-gray-600">{selectedDenuncia.revisor.nombre}</p>
                <p className="text-xs text-gray-500">{selectedDenuncia.revisor.organizacion}</p>
              </div>
            )}

            <div className="flex gap-4 pt-2 border-t">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Heart className="h-4 w-4 mr-1" />
                {selectedDenuncia.reacciones.likes}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <MessageCircle className="h-4 w-4 mr-1" />
                {selectedDenuncia.comentarios.length}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Share2 className="h-4 w-4 mr-1" />
                {selectedDenuncia.compartidos}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Eye className="h-3 w-3" />
              {selectedDenuncia.vistas} vistas
            </div>

            {selectedDenuncia.comentarios.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Comentarios</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedDenuncia.comentarios.map((comentario) => (
                    <div key={comentario.id} className="bg-gray-50 p-3 rounded text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs">{comentario.usuarioNombre}</span>
                        <Badge variant="outline" className="text-xs">
                          {comentario.usuarioRole}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-xs">{comentario.contenido}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(comentario.fechaCreacion).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
