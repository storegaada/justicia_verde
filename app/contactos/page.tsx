import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Building } from "lucide-react"
import { contactosUtiles } from "@/lib/mock-data"

export default function ContactosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="border-emerald-200 shadow-lg max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-emerald-800 text-3xl">Contactos útiles</CardTitle>
            <p className="text-gray-600 mt-2">
              Organizaciones especializadas en apoyo legal, técnico y mediación ambiental
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactosUtiles.map((contacto, index) => (
                <Card key={index} className="border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Building className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg text-emerald-900">{contacto.nombre}</h3>
                        <p className="text-sm text-gray-600">{contacto.tipo}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">{contacto.descripcion}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-emerald-600" />
                        <a href={`mailto:${contacto.email}`} className="text-emerald-700 hover:underline">
                          {contacto.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-emerald-600" />
                        <a href={`tel:${contacto.telefono}`} className="text-emerald-700 hover:underline">
                          {contacto.telefono}
                        </a>
                      </div>
                    </div>

                    <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">Contactar</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-emerald-50 rounded-lg">
              <h3 className="font-semibold text-emerald-900 mb-2">¿Necesitas más ayuda?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Si tu caso requiere atención urgente o no encuentras el apoyo adecuado, puedes contactar directamente a
                las autoridades ambientales:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • <strong>Ministerio de Ambiente:</strong> contacto@minambiente.gov.co
                </li>
                <li>
                  • <strong>Línea Nacional de Denuncias Ambientales:</strong> 01 8000 916 060
                </li>
                <li>
                  • <strong>Policía Ambiental:</strong> 123 (Emergencias)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
