"use client"

import { useState } from "react"
import { ArrowRight, Loader2, Zap } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"

interface CalculadoraProps {
  onCalcular: (texto: string) => void
  cargando: boolean
}

const EJEMPLO = "Estoy teniendo un consumo mensual de 400 soles"

export function Calculadora({ onCalcular, cargando }: CalculadoraProps) {
  const [texto, setTexto] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!texto.trim() || cargando) return
    onCalcular(texto)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <InputGroup className="h-14 rounded-2xl border-2 px-1 shadow-sm">
        <InputGroupAddon>
          <Zap className="text-primary" />
        </InputGroupAddon>
        <InputGroupInput
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={EJEMPLO}
          aria-label="Describe tu consumo mensual"
          className="text-base"
        />
        <InputGroupAddon align="inline-end">
          <Button type="submit" disabled={cargando} className="rounded-xl">
            {cargando ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Calculando
              </>
            ) : (
              <>
                Calcular
                <ArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <p className="px-2 text-xs text-muted-foreground">
        Escribe tu consumo en soles, por ejemplo:{" "}
        <button
          type="button"
          onClick={() => setTexto(EJEMPLO)}
          className="underline decoration-dotted underline-offset-2 hover:text-foreground"
        >
          &quot;{EJEMPLO}&quot;
        </button>
      </p>
    </form>
  )
}
