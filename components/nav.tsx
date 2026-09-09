"use client"

import { Zap, LayoutDashboard, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Vista } from "@/components/kallpa-app"

interface NavProps {
  vista: Vista
  onNavigate: (vista: Vista) => void
}

export function Nav({ vista, onNavigate }: NavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate("inicio")}
          className="flex items-center gap-2"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" fill="currentColor" strokeWidth={0} />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">Kallpa</span>
        </button>

        <nav className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => onNavigate("inicio")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:gap-2 sm:px-4",
              vista === "inicio"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Home data-icon="inline-start" className="hidden sm:inline" />
            Inicio
          </button>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:gap-2 sm:px-4",
              vista === "dashboard"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutDashboard data-icon="inline-start" className="hidden sm:inline" />
            Dashboard Demo
          </button>
        </nav>
      </div>
    </header>
  )
}
