/**
 * Motor de simulación NILM (Non-Intrusive Load Monitoring).
 *
 * Esta capa concentra toda la lógica de "desagregación" del consumo eléctrico
 * mensual de una pyme en sus equipos/artefactos principales. Hoy funciona con
 * perfiles de reparto simulados por tipo de negocio, pero está diseñada para
 * que en el futuro se reemplace por una llamada a un modelo real de IA/NILM
 * sin tocar ningún componente de la interfaz: solo hay que reemplazar el
 * cuerpo de `calcularDesagregacion` (o hacerla async) manteniendo la misma
 * forma de entrada/salida.
 */

export type BusinessTypeId = string

export interface BusinessType {
  id: BusinessTypeId
  label: string
  /** Texto corto que se usa en el botón selector, ej. "Soy Bodega" */
  selectorLabel: string
  icon: "store" | "utensils" | "wrench" | "factory" | "building"
  /** Equipos típicos de este negocio y su participación relativa (peso) en el consumo total */
  equipos: EquipoPerfil[]
}

export interface EquipoPerfil {
  id: string
  nombre: string
  /** Peso relativo dentro del negocio (no necesita sumar 100, se normaliza) */
  peso: number
  recomendacion: string
  /** Equipo opcional: solo aplica a algunos negocios (ej. aire acondicionado) */
  opcional?: boolean
}

export interface ResultadoEquipo {
  id: string
  nombre: string
  porcentaje: number
  costoSoles: number
  recomendacion: string
}

export interface ResultadoDesagregacion {
  negocio: BusinessTypeId
  consumoTotalSoles: number
  equipos: ResultadoEquipo[]
}

export const TIPOS_NEGOCIO: BusinessType[] = [
  {
    id: "bodega",
    label: "Bodega",
    selectorLabel: "Soy Bodega",
    icon: "store",
    equipos: [
      {
        id: "refrigeracion",
        nombre: "Refrigeradora / Congeladora",
        peso: 38,
        recomendacion:
          "Revisa el sellado de las puertas; una fuga de frío puede aumentar el consumo hasta un 15%.",
      },
      {
        id: "iluminacion",
        nombre: "Iluminación",
        peso: 22,
        recomendacion:
          "Cambia a focos LED si aún no lo hiciste: consumen hasta 80% menos que los focos incandescentes.",
      },
      {
        id: "pos",
        nombre: "Caja registradora / POS",
        peso: 14,
        recomendacion:
          "Apaga el POS y la impresora de tickets fuera de horario de atención, no solo la pantalla.",
      },
      {
        id: "aire",
        nombre: "Aire acondicionado",
        peso: 26,
        recomendacion:
          "Mantén la puerta cerrada mientras el aire está encendido y limpia los filtros cada mes.",
        opcional: true,
      },
    ],
  },
  {
    id: "restaurante",
    label: "Restaurante",
    selectorLabel: "Soy Restaurante",
    icon: "utensils",
    equipos: [
      {
        id: "coccion",
        nombre: "Cocina eléctrica / Hornos",
        peso: 34,
        recomendacion:
          "Precalienta solo el tiempo necesario y agrupa las cocciones para aprovechar el calor residual.",
      },
      {
        id: "refrigeracion",
        nombre: "Refrigeración",
        peso: 26,
        recomendacion:
          "No sobrecargues los refrigeradores: el aire debe poder circular entre los alimentos.",
      },
      {
        id: "extractor",
        nombre: "Extractor de aire",
        peso: 18,
        recomendacion:
          "Limpia los filtros de grasa cada semana; un extractor sucio consume más para el mismo flujo de aire.",
      },
      {
        id: "iluminacion",
        nombre: "Iluminación",
        peso: 22,
        recomendacion:
          "Usa iluminación cálida LED en el salón: mismo ambiente, hasta 70% menos consumo.",
      },
    ],
  },
  {
    id: "taller",
    label: "Taller",
    selectorLabel: "Soy Taller",
    icon: "wrench",
    equipos: [
      {
        id: "maquinaria",
        nombre: "Maquinaria / Herramientas eléctricas",
        peso: 40,
        recomendacion:
          "Da mantenimiento periódico a motores y rodamientos: la fricción extra se traduce en más consumo.",
      },
      {
        id: "compresor",
        nombre: "Compresor",
        peso: 24,
        recomendacion:
          "Revisa fugas de aire en mangueras y conexiones; las fugas obligan al compresor a trabajar más seguido.",
      },
      {
        id: "iluminacion",
        nombre: "Iluminación",
        peso: 16,
        recomendacion:
          "Instala sensores de presencia en zonas de paso poco usadas para evitar luces encendidas de más.",
      },
      {
        id: "soldadura",
        nombre: "Equipos de soldadura",
        peso: 20,
        recomendacion:
          "Apaga los equipos de soldadura entre trabajos largos; el modo espera sigue consumiendo energía.",
        opcional: true,
      },
    ],
  },
]

export function obtenerTipoNegocio(id: BusinessTypeId): BusinessType | undefined {
  return TIPOS_NEGOCIO.find((t) => t.id === id)
}

/**
 * Extrae un monto en soles de un texto libre como
 * "Estoy teniendo un consumo mensual de 400 soles".
 * Devuelve null si no se pudo detectar ningún número.
 */
export function extraerMontoSoles(texto: string): number | null {
  const match = texto.replace(/,/g, "").match(/(\d+(\.\d+)?)/)
  if (!match) return null
  const valor = Number.parseFloat(match[1])
  if (Number.isNaN(valor) || valor <= 0) return null
  return valor
}

/**
 * Calcula la desagregación simulada del consumo total entre los equipos
 * típicos del tipo de negocio seleccionado.
 *
 * Punto de reemplazo futuro: esta función puede convertirse en `async` y
 * delegar a un servicio de IA/NILM real. Los componentes de UI solo
 * dependen de `ResultadoDesagregacion`, así que el contrato no cambia.
 */
export function calcularDesagregacion(
  consumoTotalSoles: number,
  negocioId: BusinessTypeId,
): ResultadoDesagregacion {
  const negocio = obtenerTipoNegocio(negocioId) ?? TIPOS_NEGOCIO[0]

  // Pequeña variación pseudoaleatoria (pero determinística) para que la
  // demo no se vea perfectamente estática entre cálculos con el mismo monto.
  const seed = hashSimple(`${negocio.id}-${consumoTotalSoles}`)
  const pesosConRuido = negocio.equipos.map((equipo, i) => {
    const ruido = 1 + ((seed >> (i * 3)) % 7) / 100 - 0.03
    return { equipo, pesoAjustado: Math.max(equipo.peso * ruido, 1) }
  })

  const pesoTotal = pesosConRuido.reduce((acc, p) => acc + p.pesoAjustado, 0)

  const equipos: ResultadoEquipo[] = pesosConRuido
    .map(({ equipo, pesoAjustado }) => {
      const porcentaje = Math.round((pesoAjustado / pesoTotal) * 100)
      const costoSoles = Math.round((pesoAjustado / pesoTotal) * consumoTotalSoles)
      return {
        id: equipo.id,
        nombre: equipo.nombre,
        porcentaje,
        costoSoles,
        recomendacion: equipo.recomendacion,
      }
    })
    .sort((a, b) => b.porcentaje - a.porcentaje)

  return {
    negocio: negocio.id,
    consumoTotalSoles,
    equipos,
  }
}

function hashSimple(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// ---------------------------------------------------------------------------
// Datos simulados para el Dashboard Demo (vista de "cómo sería con el sensor
// real instalado"). Igual que arriba, esto está aislado para poder
// reemplazarse por datos reales de un sensor/API sin tocar la UI.
// ---------------------------------------------------------------------------

export interface PuntoConsumoSemanal {
  dia: string
  consumoKwh: number
  costoSoles: number
}

export interface AlertaSimulada {
  id: string
  equipo: string
  mensaje: string
  nivel: "info" | "advertencia"
  hace: string
}

export function generarConsumoSemanalDemo(): PuntoConsumoSemanal[] {
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
  const base = [18, 21, 19, 24, 27, 32, 15]
  return dias.map((dia, i) => ({
    dia,
    consumoKwh: base[i],
    costoSoles: Math.round(base[i] * 1.9),
  }))
}

export function generarAlertasDemo(): AlertaSimulada[] {
  return [
    {
      id: "1",
      equipo: "Refrigeradora",
      mensaje: "Tu refrigeradora consumió 20% más ayer respecto al promedio.",
      nivel: "advertencia",
      hace: "Hace 14 horas",
    },
    {
      id: "2",
      equipo: "Iluminación",
      mensaje: "Las luces del almacén estuvieron encendidas 3 horas fuera de horario.",
      nivel: "advertencia",
      hace: "Hace 1 día",
    },
    {
      id: "3",
      equipo: "Aire acondicionado",
      mensaje: "Detectamos un patrón de uso más eficiente esta semana. ¡Buen trabajo!",
      nivel: "info",
      hace: "Hace 2 días",
    },
  ]
}

export function generarAhorroAcumuladoDemo() {
  return {
    soles: 184,
    porcentaje: 12,
    periodo: "los últimos 30 días",
  }
}
