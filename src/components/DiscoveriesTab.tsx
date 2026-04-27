import { useState, useEffect } from 'react'

interface DiscoveryBar {
  id: number
  name: string
  location: string
  distance: number
  postPhoto: string | null
  emoji: string
  discoveryDescription: string
  discoveryText: string
}

interface DiscoveriesTabProps {
  bars: DiscoveryBar[]
  onBarClick: (barId: number) => void
}

export function DiscoveriesTab({ bars, onBarClick }: DiscoveriesTabProps) {
  const [shuffledBars, setShuffledBars] = useState<DiscoveryBar[]>([])
  const [currentIndices, setCurrentIndices] = useState<{ [key: number]: number }>({})

  // Shuffle et sélectionner les 4 établissements avec photos (aléatoire)
  useEffect(() => {
    const shuffled = [...bars].sort(() => Math.random() - 0.5)
    
    setShuffledBars(shuffled)
    
    // Initialiser les indices de photos
    const indices: { [key: number]: number } = {}
    shuffled.forEach(bar => {
      indices[bar.id] = 0
    })
    setCurrentIndices(indices)
  }, [bars])

  const handleSwipePhoto = (barId: number, direction: 'left' | 'right') => {
    // Pour le MVP, on simule juste avec postPhoto
    // Direction: left = photo suivante, right = photo précédente
    setCurrentIndices(prev => ({
      ...prev,
      [barId]: prev[barId] ?? 0
    }))
  }

  if (shuffledBars.length === 0) return null

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px', paddingBottom: '120px' }}>
      {/* PHRASE D'ACCROCHE */}
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '0', lineHeight: '1.5', fontWeight: '500' }}>
          ✨ Découvre des établissements dynamiques près de toi qui pourraient t'intéresser. Swipe pour explorer!
        </p>
      </div>

      {shuffledBars.map((bar) => (
        <div
          key={bar.id}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '24px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
          }}
          onClick={() => onBarClick(bar.id)}
        >
          {/* HEADER AVEC AVATAR */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                minWidth: '48px',
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                overflow: 'hidden',
              }}
            >
              {bar.profilePhoto ? (
                <img
                  src={bar.profilePhoto}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt={bar.name}
                />
              ) : (
                bar.emoji
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0' }}>
                {bar.name}
              </h3>
              <p style={{ fontSize: '11px', color: '#999', margin: '2px 0 0 0' }}>
                📍 {bar.location} • {bar.distance}km
              </p>
            </div>
          </div>
          {/* GROSSE PHOTO */}
          <div
            style={{
              width: '100%',
              height: '360px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              userSelect: 'none',
            }}
            onTouchStart={(e) => {
              const startX = e.touches[0].clientX
              const handleTouchEnd = (endEvent: TouchEvent) => {
                const endX = endEvent.changedTouches[0].clientX
                const distance = startX - endX
                if (Math.abs(distance) > 50) {
                  handleSwipePhoto(bar.id, distance > 0 ? 'left' : 'right')
                }
                document.removeEventListener('touchend', handleTouchEnd)
              }
              document.addEventListener('touchend', handleTouchEnd)
            }}
          >
            {bar.postPhoto ? (
              <img
                src={bar.postPhoto}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                alt={bar.name}
              />
            ) : (
              <div style={{ fontSize: '64px' }}>{bar.emoji}</div>
            )}

            {/* Indicateurs de photos (MVP: juste un point) */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                }}
              />
            </div>
          </div>

          {/* INFOS EN BAS */}
          <div style={{ padding: '16px' }}>
            {/* Description détaillée */}
            <p style={{ fontSize: '13px', color: '#1a1a1a', margin: '0 0 12px 0', lineHeight: '1.5' }}>
              {bar.discoveryDescription}
            </p>

            {/* Texte additionnel du commerçant */}
            {bar.discoveryText && (
              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 12px 0', lineHeight: '1.4', fontStyle: 'italic' }}>
                "{bar.discoveryText}"
              </p>
            )}

            {/* Bouton CTA optionnel */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onBarClick(bar.id)
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#FF6B35',
                color: 'white',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Voir plus
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
