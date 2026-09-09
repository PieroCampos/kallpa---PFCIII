"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero"
import { Calculadora } from "@/components/calculadora"
import { SelectorNegocio } from "@/components/selector_negocio"
import { ResultadoCards } from "@/components/resultado_cards"
import { DashboardDemo } from "@/components/dashboard_demo"
import { Footer } from "@/components/footer"
import {
  calcularDesagregacion,
  extraerMontoSoles,
  obtenerTipoNegocio,
  type BusinessTypeId,
  type ResultadoDesagregacion,
} from "@/lib/nilm_simulado"

export type Vista = "inicio" | "dashboard"

export function KallpaApp() {
  const [vista, setVista] = useState<Vista>("inicio")
  const [negocioId, setNegocioId] = useState<BusinessTypeId>("bodega")
  const [resultado, setResultado] = useState<ResultadoDesagregacion | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleCalcular(texto: string) {
    const monto = extraerMontoSoles(texto)
    if (monto === null) {
      setError("No pudimos detectar un monto. Intenta escribir algo como \"400 soles\".")
      return
    }
    setError(null)
    setCargando(true)
    window.setTimeout(() => {
      setResultado(calcularDesagregacion(monto, negocioId))
      setCargando(false)
    }, 1100)
  }

  function handleSelectNegocio(id: BusinessTypeId) {
    setNegocioId(id)
    if (resultado) {
      setCargando(true)
      window.setTimeout(() => {
        setResultado((prev) => (prev ? calcularDesagregacion(prev.consumoTotalSoles, id) : prev))
        setCargando(false)
      }, 700)
    }
  }

  const negocioLabel = obtenerTipoNegocio(negocioId)?.label ?? "negocio"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav vista={vista} onNavigate={setVista} />

      {vista === "inicio" ? (
        <main className="flex flex-1 flex-col">
          <Hero />

          <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
              <Calculadora onCalcular={handleCalcular} cargando={cargando} />
              {error && <p className="text-center text-sm text-destructive">{error}</p>}
              <SelectorNegocio negocioId={negocioId} onSelect={handleSelectNegocio} />
            </div>
          </section>

          {(resultado || cargando) && (
            <section className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
              <h2 className="mb-4 text-center font-heading text-xl font-bold text-foreground">
                Así se reparte el consumo de tu {negocioLabel.toLowerCase()}
              </h2>
              <ResultadoCards resultado={resultado} cargando={cargando} negocioLabel={negocioLabel} />
            </section>
          )}
        </main>
      ) : (
        <main className="flex flex-1 flex-col">
          <DashboardDemo />
        </main>
      )}

      <Footer />
    </div>
  )
}
