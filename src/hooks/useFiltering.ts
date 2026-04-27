import { useMemo, useState } from 'react'

export interface Bar {
  id: number
  name: string
  category: string
  distance: number
  filters: string[]
  currentStatus: {
    terrasseDispo: boolean
    offreActive: boolean
    eventActive: boolean
    happyHourActive: boolean
    lastUpdated: number
  }
  [key: string]: any
}

interface UseFilteringProps {
  bars: Bar[]
  searchTerm: string
  selectedCategory: string | null
  selectedFilters: string[]
}

interface UseFilteringReturn {
  filteredBars: Bar[]
  floatingButtonCounts: {
    terrasse: number
    offre: number
    event: number
    happyHour: number
  }
}

export function useFiltering({
  bars,
  searchTerm,
  selectedCategory,
  selectedFilters,
  activeFloatingFilter = null,
}: UseFilteringProps & { activeFloatingFilter?: string | null }): UseFilteringReturn {
  const filteredBars = useMemo(() => {
    return bars.filter((bar) => {
      // Recherche par nom
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = bar.name.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false

      // Catégorie
      if (selectedCategory && bar.category !== selectedCategory) return false

      // Filtres équipements (AND logic)
      if (selectedFilters.length > 0 && !selectedFilters.every((f) => bar.filters.includes(f))) {
        return false
      }

      // Floating filter (un seul à la fois)
      if (activeFloatingFilter) {
        if (activeFloatingFilter === 'terrasse' && !bar.currentStatus.terrasseDispo) return false
        if (activeFloatingFilter === 'offre' && !bar.currentStatus.offreActive) return false
        if (activeFloatingFilter === 'event' && !bar.currentStatus.eventActive) return false
        if (activeFloatingFilter === 'happyHour' && !bar.currentStatus.happyHourActive) return false
      }

      return true
    }).sort((a, b) => a.distance - b.distance)
  }, [bars, searchTerm, selectedCategory, selectedFilters, activeFloatingFilter])

  const floatingButtonCounts = useMemo(() => {
    return {
      terrasse: bars.filter(b => b.currentStatus.terrasseDispo).length,
      offre: bars.filter(b => b.currentStatus.offreActive).length,
      event: bars.filter(b => b.currentStatus.eventActive).length,
      happyHour: bars.filter(b => b.currentStatus.happyHourActive).length,
    }
  }, [bars])

  return {
    filteredBars,
    floatingButtonCounts,
  }
}
