"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { TrendingDown, AlertTriangle, Info, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  generarAhorroAcumuladoDemo,
  generarAlertasDemo,
  generarConsumoSemanalDemo,
} from "@/lib/nilm_simulado"

const chartConfig = {
  consumoKwh: {
    label: "Consumo (kWh)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function DashboardDemo() {
  const consumoSemanal = generarConsumoSemanalDemo()
  const alertas = generarAlertasDemo()
  const ahorro = generarAhorroAcumuladoDemo()

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Así se vería con el sensor instalado
          </h2>
          <Badge className="bg-accent text-accent-foreground">Demo</Badge>
        </div>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Una vista previa de tu panel de monitoreo en tiempo real: consumo diario, alertas automáticas
          y el ahorro que vas acumulando mes a mes.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Consumo de esta semana</CardTitle>
            <CardDescription>Datos simulados, en kWh por día</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
              <AreaChart data={consumoSemanal} margin={{ left: 0, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillConsumo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-consumoKwh)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-consumoKwh)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${value} kWh`, ""]}
                      labelKey="dia"
                    />
                  }
                />
                <Area
                  dataKey="consumoKwh"
                  type="monotone"
                  fill="url(#fillConsumo)"
                  stroke="var(--color-consumoKwh)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center gap-4 bg-primary text-primary-foreground">
          <CardHeader className="gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/15">
              <TrendingDown className="size-5" />
            </span>
            <CardTitle className="text-primary-foreground">Ahorro acumulado</CardTitle>
            <CardDescription className="text-primary-foreground/75">
              En {ahorro.periodo}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl font-bold">S/ {ahorro.soles}</p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              {ahorro.porcentaje}% menos que tu consumo habitual
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            Alertas recientes
          </CardTitle>
          <CardDescription>Notificaciones automáticas basadas en tu patrón de consumo</CardDescription>
        </CardHeader>
        <CardContent className="gap-3">
          {alertas.map((alerta) => (
            <div
              key={alerta.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-3.5"
            >
              <span
                className={
                  alerta.nivel === "advertencia"
                    ? "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                    : "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                }
              >
                {alerta.nivel === "advertencia" ? (
                  <AlertTriangle className="size-4" />
                ) : (
                  <Info className="size-4" />
                )}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm leading-relaxed text-pretty text-foreground">
                  <span className="font-medium">{alerta.equipo}: </span>
                  {alerta.mensaje}
                </p>
                <span className="text-xs text-muted-foreground">{alerta.hace}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
