"use client"

import { Store, UtensilsCrossed, Wrench, Factory, Building2 } from "lucide-react"
import { TIPOS_NEGOCIO, type BusinessTypeId } from "@/lib/nilm_simulado"
import { cn } from "@/lib/utils"

const ICONOS = {
  store: Store,
  utensils: UtensilsCrossed,
  wrench: Wrench,
  factory: Factory,
  building: Building2,
} as const

interface SelectorNegocioProps {
  negocioId: BusinessTypeId
  onSelect: (id: BusinessTypeId) => void
}

export function SelectorNegocio({ negocioId, onSelect }: SelectorNegocioProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {TIPOS_NEGOCIO.map((negocio) => {
        const Icon = ICONOS[negocio.icon]
        const activo = negocio.id === negocioId
        return (
          <button
            key={negocio.id}
            type="button"
            onClick={() => onSelect(negocio.id)}
            aria-pressed={activo}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              activo
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {negocio.selectorLabel}
          </button>
        )
      })}
    </div>
  )
}
