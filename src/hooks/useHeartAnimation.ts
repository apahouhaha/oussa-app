import { useState } from 'react'

export interface FloatingHeart {
  id: number
  startX: number
  startY: number
}

export function useHeartAnimation() {
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])

  const createHearts = (clickX: number, clickY: number) => {
    // Créer 3 cœurs avec positions aléatoires autour du clic
    for (let i = 0; i < 3; i++) {
      const heartId = Date.now() + i

      // Position aléatoire autour du clic (±40px)
      const startX = clickX + (Math.random() - 0.5) * 80
      const startY = clickY + (Math.random() - 0.5) * 80

      setFloatingHearts((prev) => [...prev, { id: heartId, startX, startY }])

      // Supprimer le cœur après l'animation (2.5s)
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId))
      }, 2500)
    }
  }

  return {
    floatingHearts,
    createHearts,
  }
}
