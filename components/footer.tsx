import { Zap } from "lucide-react"
import { Redes } from "@/components/redes"

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-3.5" fill="currentColor" strokeWidth={0} />
          </span>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold text-foreground">Kallpa</span>
            <span className="text-xs text-muted-foreground">Energía visible para tu negocio</span>
          </div>
        </div>

        <p className="max-w-sm text-center text-xs leading-relaxed text-muted-foreground sm:text-left">
          Kallpa es una demo de análisis energético simulado (NILM). Los resultados son estimaciones
          referenciales y no reemplazan una medición certificada.
        </p>

        <Redes />
      </div>
    </footer>
  )
}
