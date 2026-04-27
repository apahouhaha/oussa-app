import { useState, useEffect, useRef } from 'react'

interface SponsorBar {
  id: number
  name: string
  sponsorMessage: string
  location: string
  distance: number
  profilePhoto: string | null
  emoji: string
}

interface SponsorshipBannerProps {
  sponsors: SponsorBar[]
  onBarClick: (barId: number) => void
}

export function SponsorshipBanner({ sponsors, onBarClick }: SponsorshipBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  if (sponsors.length === 0) return null

  const currentSponsor = sponsors[currentIndex]

  // Auto-scroll toutes les 8 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [sponsors.length])

  // Gestion du swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.clientX || e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.clientX || e.changedTouches[0].clientX
    handleSwipe()
  }

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      // Swipe gauche → bar suivant
      setCurrentIndex((prev) => (prev + 1) % sponsors.length)
    } else if (isRightSwipe) {
      // Swipe droite → bar précédent
      setCurrentIndex((prev) => (prev - 1 + sponsors.length) % sponsors.length)
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        height: '100px',
        backgroundColor: '#DAA520',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      onClick={() => onBarClick(currentSponsor.id)}
    >
      {/* Avatar */}
      <div
        style={{
          width: '76px',
          height: '76px',
          minWidth: '76px',
          borderRadius: '50%',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          overflow: 'hidden',
          border: '3px solid white',
        }}
      >
        {currentSponsor.profilePhoto ? (
          <img
            src={currentSponsor.profilePhoto}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt={currentSponsor.name}
          />
        ) : (
          currentSponsor.emoji
        )}
      </div>

      {/* Infos */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>
          {currentSponsor.name}
        </h3>
        <p style={{ fontSize: '12px', color: '#333', margin: '0 0 6px 0', fontWeight: '500' }}>
          {currentSponsor.sponsorMessage}
        </p>
        <div style={{ fontSize: '11px', color: '#555' }}>
          📍 {currentSponsor.location} • {currentSponsor.distance}km
        </div>
      </div>

      {/* Indicateur de progression */}
      <div style={{ display: 'flex', gap: '4px', minWidth: '50px' }}>
        {sponsors.map((_, i) => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: i === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
