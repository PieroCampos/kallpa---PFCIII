import Image from "next/image"
import { Sparkles } from "lucide-react"

const RUBROS = [
  { label: "Bodega", src: "/images/bodega.png" },
  { label: "Restaurante", src: "/images/restaurante.png" },
  { label: "Taller", src: "/images/taller.png" },
]

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 pb-6 sm:px-6 sm:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-5">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Inteligencia energética para pymes
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            Descubre en qué se va la electricidad de tu negocio
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Kallpa analiza tu recibo de luz y, sin instalar ningún sensor, te muestra qué equipos consumen
            más energía en tu bodega, restaurante o taller — y cómo ahorrar en tu próximo recibo.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {RUBROS.map((rubro, i) => (
            <div
              key={rubro.label}
              className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-2 duration-700"
              style={{ animationDelay: `${i * 120}ms`, animationFillMode: "backwards" }}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-card">
                <Image
                  src={rubro.src || "/placeholder.svg"}
                  alt={`Ilustración de ${rubro.label.toLowerCase()}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{rubro.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
