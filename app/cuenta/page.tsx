"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserRole } from "@/types"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function CuentaPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [role, setRole] = useState<UserRole>("demandante")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login, user } = useAuth()
  const router = useRouter()

  if (user) {
    if (user.role === "admin") {
      router.push("/admin")
    } else if (user.role === "revisor") {
      router.push("/revisor")
    } else {
      router.push("/mis-denuncias")
    }
    return null
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    setTimeout(() => {
      const loginSuccess = login(email, password)

      if (loginSuccess) {
        setSuccess("Inicio de sesión exitoso. Redirigiendo...")
        setTimeout(() => {
          setIsLoading(false)
          // La redirección se maneja automáticamente por el useEffect arriba
          window.location.reload()
        }, 1000)
      } else {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.")
        setIsLoading(false)
      }
    }, 500)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("Registro simulado exitoso. En producción, esto crearía un usuario en Firebase.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto border-emerald-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-emerald-800 text-2xl text-center">Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                <TabsTrigger value="registro">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-emerald-300"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-emerald-300"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>

                  <div className="text-sm text-gray-600 bg-emerald-50 p-4 rounded-lg mt-4 border border-emerald-200">
                    <p className="font-semibold mb-3 text-emerald-900">Credenciales de prueba:</p>
                    <div className="space-y-3">
                      <div className="bg-white p-2 rounded border border-emerald-100">
                        <p className="font-mono text-xs font-semibold text-emerald-700">admin@gmail.com</p>
                        <p className="text-xs text-gray-600 mt-1">Rol: Administrador</p>
                        <p className="text-xs text-gray-500">Contraseña: 12345678</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-emerald-100">
                        <p className="font-mono text-xs font-semibold text-emerald-700">demandante@gmail.com</p>
                        <p className="text-xs text-gray-600 mt-1">Rol: Demandante (Ciudadano)</p>
                        <p className="text-xs text-gray-500">Contraseña: 12345678</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-emerald-100">
                        <p className="font-mono text-xs font-semibold text-emerald-700">visualizador@gmail.com</p>
                        <p className="text-xs text-gray-600 mt-1">Rol: Visualizador (Revisor Legal)</p>
                        <p className="text-xs text-gray-500">Contraseña: 12345678</p>
                      </div>
                    </div>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="registro">
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-nombre">Nombre completo</Label>
                    <Input
                      id="register-nombre"
                      placeholder="Juan Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="border-emerald-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-emerald-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-emerald-300"
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Tipo de cuenta</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                      <SelectTrigger id="role" className="border-emerald-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demandante">Ciudadano (Denunciante)</SelectItem>
                        <SelectItem value="revisor">Profesional Legal (Visualizador)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-600">
                      {role === "demandante"
                        ? "Podrás crear y seguir tus denuncias"
                        : "Podrás revisar denuncias y ofrecer apoyo legal"}
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Crear cuenta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 text-sm mb-2">Roles disponibles:</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>
                  • <strong>Demandante:</strong> Crea y gestiona denuncias ambientales
                </li>
                <li>
                  • <strong>Visualizador:</strong> Profesional legal que revisa y toma casos
                </li>
                <li>
                  • <strong>Admin:</strong> Gestiona la plataforma y valida reportes
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
