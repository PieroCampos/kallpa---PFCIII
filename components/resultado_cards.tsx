"use client"

import { useState } from "react"
import { ChevronDown, Lightbulb, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { ResultadoDesagregacion } from "@/lib/nilm_simulado"

interface ResultadoCardsProps {
  resultado: ResultadoDesagregacion | null
  cargando: boolean
  negocioLabel: string
}

export function ResultadoCards({ resultado, cargando, negocioLabel }: ResultadoCardsProps) {
  if (cargando) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Analizando el consumo de tu {negocioLabel.toLowerCase()}…
        </p>
      </div>
    )
  }

  if (!resultado) return null

  return (
    <div
      className={cn(
        "grid gap-4 transition-all duration-500 sm:grid-cols-2",
        cargando ? "scale-[0.98] opacity-40 blur-sm" : "opacity-100",
      )}
    >
      {resultado.equipos.map((equipo, i) => (
        <ResultadoCard key={equipo.id} equipo={equipo} index={i} />
      ))}
    </div>
  )
}

function ResultadoCard({
  equipo,
  index,
}: {
  equipo: ResultadoDesagregacion["equipos"][number]
  index: number
}) {
  const [abierto, setAbierto] = useState(false)

  return (
    <Card
      className="animate-in fade-in slide-in-from-bottom-3 gap-3 duration-500"
      style={{ animationDelay: `${index * 90}ms`, animationFillMode: "backwards" }}
    >
      <CardHeader className="gap-1">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-snug">{equipo.nombre}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {equipo.porcentaje}%
          </Badge>
        </div>
        <p className="font-heading text-2xl font-bold text-primary">S/ {equipo.costoSoles}</p>
      </CardHeader>
      <CardContent className="gap-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${equipo.porcentaje}%` }}
          />
        </div>

        <Collapsible open={abierto} onOpenChange={setAbierto}>
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 text-left text-sm font-medium text-muted-foreground hover:text-foreground">
            <span className="flex items-center gap-1.5">
              <Lightbulb className="size-3.5 text-accent" />
              Ver recomendación
            </span>
            <ChevronDown
              className={cn("size-4 transition-transform", abierto && "rotate-180")}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
              {equipo.recomendacion}
            </p>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
