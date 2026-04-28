import { useState } from 'react'

export interface FloatingHeart {
  id: number
  startX: number
  startY: number
}

export function useHeartAnimation() {
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])

  const createHearts = (clickX: number, clickY: number) => {
    // Utiliser le centre de la viewport au lieu de coordonnées complexes
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    const newHearts = [
      { id: Date.now(), startX: centerX, startY: centerY },
      { id: Date.now() + 1, startX: centerX, startY: centerY },
      { id: Date.now() + 2, startX: centerX, startY: centerY },
    ]

    setFloatingHearts((prev) => [...prev, ...newHearts])

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.map(nh => nh.id).includes(h.id)))
    }, 1800)
  }

  return {
    floatingHearts,
    createHearts,
  }
}
