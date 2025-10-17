"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Leaf, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

  const getNavItems = () => {
    const baseItems = [
      { href: "/", label: "Inicio" },
      { href: "/mapa", label: "Mapa" },
      { href: "/datos-abiertos", label: "Datos Abiertos" },
      { href: "/contactos", label: "Contactos" },
    ]

    if (!isAuthenticated) {
      return [...baseItems, { href: "/denuncia", label: "Hacer Denuncia" }]
    }

    if (user?.role === "admin") {
      return [...baseItems, { href: "/admin", label: "Administración" }, { href: "/denuncia", label: "Hacer Denuncia" }]
    }

    if (user?.role === "revisor") {
      return [...baseItems, { href: "/revisor", label: "Mis Casos" }, { href: "/denuncia", label: "Hacer Denuncia" }]
    }

    // demandante
    return [
      ...baseItems,
      { href: "/denuncia", label: "Hacer Denuncia" },
      { href: "/mis-denuncias", label: "Mis Denuncias" },
    ]
  }

  const navItems = getNavItems()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-emerald-700 text-white shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-emerald-800 p-2 rounded-lg">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg leading-tight">JUSTICIA VERDE</div>
            <div className="text-xs font-normal text-emerald-100">Denuncias ambientales</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={
                  pathname === item.href
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "text-white hover:bg-emerald-600"
                }
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white text-emerald-700 hover:bg-emerald-50">
                <User className="h-4 w-4 mr-2" />
                {user.nombre}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-semibold">{user.nombre}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    {user.role === "admin" ? "Administrador" : user.role === "revisor" ? "Revisor" : "Demandante"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Panel de Administración</Link>
                </DropdownMenuItem>
              )}
              {user.role === "revisor" && (
                <DropdownMenuItem asChild>
                  <Link href="/revisor">Mis Casos</Link>
                </DropdownMenuItem>
              )}
              {user.role === "demandante" && (
                <DropdownMenuItem asChild>
                  <Link href="/mis-denuncias">Mis Denuncias</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/cuenta">
            <Button variant="outline" className="bg-white text-emerald-700 hover:bg-emerald-50">
              Cuenta
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
