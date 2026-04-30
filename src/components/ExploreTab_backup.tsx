import { useState, useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BARS } from '../data/bars'
import { FILTERS } from '../data/filters'
import { COLORS } from '../constants/styles'

interface ExploreTabProps {
  filteredBars: typeof BARS
  likes: Record<number, boolean>
  likeCount: Record<number, number>
  onLike: (barId: number) => void
  onBarClick: (bar: typeof BARS[0]) => void
}

const USER_POSITION: [number, number] = [50.6844, 3.1556]

const BAR_COORDS: Record<number, [number, number]> = {
  1: [50.6844, 3.1556], 2: [50.6720, 3.1450], 3: [50.6650, 3.2100], 4: [50.6900, 3.1600],
  5: [50.6500, 3.2300], 6: [50.6750, 3.1400], 7: [50.6820, 3.1580], 8: [50.6600, 3.2150],
  9: [50.6730, 3.1380], 10: [50.6860, 3.1620], 11: [50.6880, 3.1540], 12: [50.6740, 3.1420],
  13: [50.6520, 3.2280], 14: [50.6810, 3.1590], 15: [50.6760, 3.1390], 16: [50.6620, 3.2140],
  17: [50.6850, 3.1610], 18: [50.6750, 3.1400], 19: [50.6540, 3.2260], 20: [50.6830, 3.1570],
}

export function ExploreTab({ filteredBars, likes, likeCount, onLike, onBarClick }: ExploreTabProps) {
  const [sheetOpen, setSheetOpen] = useState(true)  // START OPEN
  const [selectedBarOnMap, setSelectedBarOnMap] = useState<typeof BARS[0] | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const touchStartY = useRef(0)
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const barMarkersRef = useRef<L.CircleMarker[]>([])

  const barsToDisplay = filteredBars.filter(bar => {
    if (selectedCategory && bar.category !== selectedCategory) return false
    if (searchTerm && !bar.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (selectedFilters.length > 0 && !selectedFilters.every(f => bar.filters.includes(f))) return false
    return true
  })

  // Initialize map - SIMPLIFIED
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    try {
      const map = L.map(mapContainerRef.current, {
        center: USER_POSITION,
        zoom: 15,
        zoomControl: true,
        attributionControl: false
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: false,
        maxZoom: 19,
        minZoom: 10
      }).addTo(map)

      mapRef.current = map
      console.log('Map initialized successfully')
    } catch (error) {
      console.error('Map initialization error:', error)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Add bar markers - SIMPLIFIED (temporarily disabled for debugging)
  useEffect(() => {
    console.log('Bar markers effect triggered')
    // Disabled for now to debug freeze
  }, [barsToDisplay])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchEndY - touchStartY.current

    if (diff > 50 && sheetOpen) {
      setSheetOpen(false)
    } else if (diff < -50 && !sheetOpen) {
      setSheetOpen(true)
    }

    touchStartY.current = 0
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 'calc(100% - 60px)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: '#ffffff'
    }}>
      <style>{`
        .leaflet-attribution,
        .leaflet-control-attribution {
          display: none !important;
        }
        .leaflet-tiles-light img {
          filter: grayscale(90%) brightness(1.15) contrast(0.95);
          opacity: 0.85;
        }
      `}</style>

      {/* MAP */}
      <div
        ref={mapContainerRef}
        style={{
          flex: sheetOpen ? '0 0 40%' : '1',
          position: 'relative',
          transition: 'flex 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          overflow: 'hidden',
          backgroundColor: '#f8f8f8'
        }}
      />

      {/* Recenter button - overlaid on map */}
      <button
        onClick={() => {
          if (mapRef.current) {
            mapRef.current.setView(USER_POSITION, 15, { animate: true })
          }
        }}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 9997,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          transition: 'all 0.2s',
          pointerEvents: 'auto'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)')}
        title="Recentrer sur ma position"
      >
        📍
      </button>

      {/* Mini card - no overlay blocking clicks */}
      {selectedBarOnMap && (
        <div 
          style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '14px',
          width: '88%',
          maxWidth: '300px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
          zIndex: 9998,
          animation: 'slideUp 0.3s ease-out',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setSelectedBarOnMap(null)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#999',
              padding: '0'
            }}
          >
            ✕
          </button>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', paddingRight: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
              {selectedBarOnMap.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '2px' }}>
                {selectedBarOnMap.name}
              </div>
              <div style={{ fontSize: '11px', color: '#999' }}>
                📍 {selectedBarOnMap.distance}km
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => { setSelectedBarOnMap(null); onBarClick(selectedBarOnMap) }}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Fiche
            </button>
            <button
              onClick={() => onLike(selectedBarOnMap.id)}
              style={{
                padding: '8px 10px',
                backgroundColor: likes[selectedBarOnMap.id] ? COLORS.primary : '#f5f5f5',
                color: likes[selectedBarOnMap.id] ? 'white' : '#999',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {likes[selectedBarOnMap.id] ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET - use maxHeight to respect parent constraints */}
      <div style={{
        maxHeight: sheetOpen ? '70vh' : '60px',
        flex: sheetOpen ? '0 0 auto' : '0 0 60px',
        backgroundColor: '#ffffff',
        borderRadius: sheetOpen ? '0' : '20px 20px 0 0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'maxHeight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        overflow: 'hidden'
      }}>
        {/* HANDLE */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setSheetOpen(!sheetOpen)}
          style={{
            padding: '16px 0',
            backgroundColor: '#f9f9f9',
            cursor: 'grab',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            touchAction: 'none',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <div style={{ width: '48px', height: '4px', backgroundColor: '#999', borderRadius: '2px' }} />
        </div>

        {/* CONTENT */}
        {sheetOpen && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px', paddingBottom: '120px' }}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                marginBottom: '12px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px' }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  padding: '6px 10px',
                  backgroundColor: selectedCategory === null ? COLORS.primary : '#ffffff',
                  color: selectedCategory === null ? 'white' : '#333',
                  border: selectedCategory === null ? `2px solid ${COLORS.primary}` : '2px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== null) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0'
                    e.currentTarget.style.borderColor = '#999'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== null) {
                    e.currentTarget.style.backgroundColor = '#ffffff'
                    e.currentTarget.style.borderColor = '#ddd'
                  }
                }}
              >
                Tous
              </button>
              {[
                { id: 'bars', emoji: '🍻', label: 'Bars' },
                { id: 'restos', emoji: '🍽️', label: 'Restos' },
                { id: 'clubs', emoji: '🎵', label: 'Clubs' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: selectedCategory === cat.id ? COLORS.primary : '#ffffff',
                    color: selectedCategory === cat.id ? 'white' : '#333',
                    border: selectedCategory === cat.id ? `2px solid ${COLORS.primary}` : '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== cat.id) {
                      e.currentTarget.style.backgroundColor = '#f0f0f0'
                      e.currentTarget.style.borderColor = '#999'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== cat.id) {
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.borderColor = '#ddd'
                    }
                  }}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilters(prev => prev.includes(f.id) ? prev.filter(x => x !== f.id) : [...prev, f.id])}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: selectedFilters.includes(f.id) ? COLORS.primary : '#ffffff',
                    color: selectedFilters.includes(f.id) ? 'white' : '#333',
                    border: selectedFilters.includes(f.id) ? `2px solid ${COLORS.primary}` : '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedFilters.includes(f.id)) {
                      e.currentTarget.style.backgroundColor = '#f0f0f0'
                      e.currentTarget.style.borderColor = '#999'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedFilters.includes(f.id)) {
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.borderColor = '#ddd'
                    }
                  }}
                >
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            <div style={{ fontSize: '12px', color: '#999', fontWeight: '500', marginBottom: '12px' }}>
              {barsToDisplay.length} résultat{barsToDisplay.length !== 1 ? 's' : ''}
            </div>

            {barsToDisplay.map((bar) => (
              <div
                key={bar.id}
                onClick={() => onBarClick(bar)}
                style={{
                  backgroundColor: '#fafafa',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '10px',
                  display: 'flex',
                  gap: '12px',
                  cursor: 'pointer',
                  border: '1px solid #f0f0f0'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0,
                  border: '1px solid #e8e8e8'
                }}>
                  {bar.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '2px' }}>
                    {bar.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    📍 {bar.location} • {bar.distance}km
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onLike(bar.id) }}
                  style={{
                    backgroundColor: likes[bar.id] ? COLORS.primary : '#f5f5f5',
                    color: likes[bar.id] ? 'white' : '#999',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px'
                  }}
                >
                  {likes[bar.id] ? '❤️' : '🤍'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
