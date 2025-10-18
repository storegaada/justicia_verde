// Configuración de conexión a MySQL
import mysql from "mysql2/promise"

// Configuración de la conexión
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "justicia_verde",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Pool de conexiones
let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

// Función helper para ejecutar queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await getPool().getConnection()
  try {
    const [results] = await connection.execute(sql, params)
    return results as T
  } finally {
    connection.release()
  }
}

// Verificar conexión
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await getPool().getConnection()
    connection.release()
    console.log("[v0] Conexión a MySQL exitosa")
    return true
  } catch (error) {
    console.error("[v0] Error al conectar con MySQL:", error)
    return false
  }
}
