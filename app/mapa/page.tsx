"use client"

import dynamic from "next/dynamic"
import { SidebarInfo } from "@/components/sidebar-info"
import { mockDenuncias } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MapaInteractivo = dynamic(() => import("@/components/mapa-interactivo").then((mod) => mod.MapaInteractivo), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
})

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-800 text-2xl">Mapa de denuncias</CardTitle>
              </CardHeader>
              <CardContent>
                <MapaInteractivo denuncias={mockDenuncias} height="600px" />
                <p className="text-sm text-gray-600 mt-4">Haz clic en un marcador para ver detalles y evidencia.</p>
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
