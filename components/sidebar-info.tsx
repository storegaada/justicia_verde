import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Map, Users, Download } from "lucide-react"
import Link from "next/link"
import { contactosUtiles } from "@/lib/mock-data"

export function SidebarInfo() {
  return (
    <div className="space-y-4">
      <Card className="border-emerald-200 bg-white shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-emerald-800">Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Inicia sesión para ver historial y gestionar denuncias propias. Si eres el administrador usa{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">admin@jv.test</code>.
          </p>
          <div className="flex gap-2">
            <Link href="/cuenta" className="flex-1">
              <Button className="w-full bg-emerald-700 hover:bg-emerald-800">Iniciar sesión</Button>
            </Link>
            <Link href="/cuenta?tab=registro" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-emerald-700 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                Registrarse
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 bg-white shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-emerald-800">Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/denuncia" className="block">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Nueva denuncia
            </Button>
          </Link>
          <Link href="/mapa" className="block">
            <Button
              variant="outline"
              className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <Map className="mr-2 h-4 w-4" />
              Mapa
            </Button>
          </Link>
          <Link href="/contactos" className="block">
            <Button
              variant="outline"
              className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <Users className="mr-2 h-4 w-4" />
              Contactos
            </Button>
          </Link>
          <Link href="/datos-abiertos" className="block">
            <Button
              variant="outline"
              className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar todas (JSON)
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 bg-white shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-emerald-800">Contactos útiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactosUtiles.slice(0, 3).map((contacto, index) => (
            <div key={index} className="border-b border-emerald-100 pb-3 last:border-0 last:pb-0">
              <h4 className="font-semibold text-emerald-900">{contacto.nombre}</h4>
              <p className="text-xs text-gray-600 mb-1">{contacto.tipo}</p>
              <a href={`mailto:${contacto.email}`} className="text-sm text-emerald-700 hover:underline">
                {contacto.email}
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
