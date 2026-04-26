import { useState, useEffect, useRef } from 'react'
import { BARS, isSponsashipActive } from '../data/bars'
import { COLORS } from '../constants/styles'

export function SponsorshipBanner({ onSelectBar }: { onSelectBar?: (bar: any) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Récupère seulement les bars avec sponsorship tier 40+ (bannière déroulante)
  const sponsoredBars = BARS.filter(
    bar => (bar.sponsorshipTier === 40 || bar.sponsorshipTier === 50) && isSponsashipActive(bar.sponsorshipEndDate)
  )

  useEffect(() => {
    if (sponsoredBars.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsoredBars.length)
    }, 5000) // Change toutes les 5s

    return () => clearInterval(interval)
  }, [sponsoredBars.length])

  // Swipe/Drag handler
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    const diff = startX - e.clientX
    if (Math.abs(diff) > 50) { // Minimum 50px pour compter comme swipe
      if (diff > 0) {
        // Swipe vers la gauche = bar suivant
        setCurrentIndex((prev) => (prev + 1) % sponsoredBars.length)
      } else {
        // Swipe vers la droite = bar précédent
        setCurrentIndex((prev) => (prev - 1 + sponsoredBars.length) % sponsoredBars.length)
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    const diff = startX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % sponsoredBars.length)
      } else {
        setCurrentIndex((prev) => (prev - 1 + sponsoredBars.length) % sponsoredBars.length)
      }
    }
  }

  if (sponsoredBars.length === 0) return null

  const bar = sponsoredBars[currentIndex]

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: COLORS.accent,
        padding: '12px 16px',
        borderBottom: '3px solid ' + COLORS.primary,
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        transition: isDragging ? 'none' : 'all 0.3s ease',
        userSelect: 'none',
        minHeight: '120px',
      }}
      onClick={() => {
        if (onSelectBar && !isDragging) onSelectBar(bar)
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Logo/Avatar du bar */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '3px solid ' + COLORS.primary,
        }}
      >
        {bar.profilePhoto ? (
          <img src={bar.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          bar.emoji
        )}
      </div>

      {/* Infos texte - TEXTE TRÈS AGRANDI */}
      <div style={{ flex: 1, textAlign: 'left', minWidth: '220px' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '3px', lineHeight: '1.2' }}>
          ✨ {bar.name}
        </div>
        {bar.tagline && (
          <div style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '500', marginBottom: '4px', lineHeight: '1.3' }}>
            {bar.tagline}
          </div>
        )}
        <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.2' }}>
          📍 {bar.distance}km • {bar.location}
        </div>
      </div>
    </div>
  )
}
