import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BARS } from '../data/bars'
import { FILTERS } from '../data/filters'
import { COLORS } from '../constants/styles'

const MAP_API_KEY = 'AIzaSyCS2JZlT6_ZbHtjarABOZk9VkCnjVwDzT4'

// Snap points as percentages of screen height
const SNAP_POINTS = {
  CLOSED: 10,      // 10% - just the handle visible
  MIDDLE: 50,      // 50% - half-open
  OPEN: 85         // 85% - open but navbar still visible (was 95, too high)
}

export function ExploreTab({ filteredBars, likes, onLike, onBarClick }: any) {
  const windowHeightRef = useRef(window.innerHeight)

  // Calculate snap points in pixels FIRST (before state)
  // Calculate snap points - 3 points: closed (map), filters (between), open (list)
  const snapPointsPixels = {
    closed: -110,                                  // Bottom - map view
    filters: -300,                                 // Middle - show filters only (no list)
    open: -(windowHeightRef.current - 60)         // Top - list view (leaving 60px for handle visibility)
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  // Start at CLOSED snap point (showing map)
  const [panelY, setPanelY] = useState(snapPointsPixels.closed)
  const [isScrollable, setIsScrollable] = useState(false)
  const [selectedBar, setSelectedBar] = useState<any>(null)
  
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const userMarkerRef = useRef<google.maps.Marker | null>(null)

  // Simple filtering logic
  const barsToDisplay = (filteredBars || BARS).filter((bar: any) => {
    if (selectedCategory && bar.category !== selectedCategory) return false
    if (searchTerm && !bar.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (selectedFilters.length > 0 && !selectedFilters.every(f => bar.filters.includes(f))) return false
    return true
  }).sort((a: any, b: any) => a.distance - b.distance)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    
    // Si un terme est entré, trouver le bar et centrer la carte
    if (term.trim()) {
      const foundBar = barsToDisplay.find(bar => 
        bar.name.toLowerCase().includes(term.toLowerCase())
      )
      
      if (foundBar && mapRef.current) {
        // Centrer la map sur le commerce trouvé (avec offset aléatoire)
        const offsetLat = 50.6844 + (Math.random() - 0.5) * 0.08
        const offsetLng = 3.1556 + (Math.random() - 0.5) * 0.08
        
        mapRef.current.panTo({ lat: offsetLat, lng: offsetLng })
        mapRef.current.setZoom(16)
        
        // Ouvrir la mini-fiche du commerce
        setSelectedBar(foundBar)
        
        // Fermer le clavier (si sur mobile)
        ;(document.activeElement as HTMLElement)?.blur()
      }
    }
  }

  // Find nearest snap point - 3 points now
  const getClosestSnapPoint = (currentY: number) => {
    const points = [snapPointsPixels.closed, snapPointsPixels.filters, snapPointsPixels.open]
    return points.reduce((prev, curr) =>
      Math.abs(curr - currentY) < Math.abs(prev - currentY) ? curr : prev
    )
  }

  // Monitor panel Y to enable/disable scroll
  const handlePanelDragEnd = (event: any, info: any) => {
    // Use point.y (absolute position) not offset.y (relative)
    const closestSnap = getClosestSnapPoint(info.point.y)
    setPanelY(closestSnap)
    
    // Enable scroll only when panel is at or near the OPEN position
    setIsScrollable(closestSnap >= snapPointsPixels.open * 0.95)
  }

  const handlePanelDrag = (event: any, info: any) => {
    // Update scroll state during drag - use point.y for absolute position
    const currentY = info.point.y
    setIsScrollable(currentY >= snapPointsPixels.open * 0.95)
  }

  // Initialize Google Maps with Silver style and user position
  useEffect(() => {
    const mapContainer = document.getElementById('google-maps-explore')
    if (!mapContainer || mapRef.current) return

    mapRef.current = new google.maps.Map(mapContainer, {
      center: { lat: 50.6844, lng: 3.1556 },
      zoom: 14,
      disableDefaultUI: true,
      gestureHandling: 'greedy',  // Permet de déplacer la carte avec 1 seul doigt
      styles: [
        // Masquer TOUS les points d'intérêt Google (restaurants, boutiques, etc.)
        { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
        
        // Style Silver - Contraste maximal des rues
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d0e3ff' }] },
        { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        
        // Rendre les noms des rues lisibles mais discrets
        { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] }
      ]
    })

    // Add user position marker (Mouvaux) - blue dot with white circle
    const userSVG = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Ccircle cx="24" cy="24" r="20" fill="none" stroke="white" stroke-width="3"/%3E%3Ccircle cx="24" cy="24" r="12" fill="%234285F4" /%3E%3Ccircle cx="24" cy="24" r="6" fill="white" /%3E%3C/svg%3E`
    userMarkerRef.current = new google.maps.Marker({
      position: { lat: 50.6844, lng: 3.1556 },
      map: mapRef.current,
      icon: userSVG,
      title: 'Ta position'
    })

    // Click on map to close selected bar
    mapRef.current.addListener('click', () => {
      setSelectedBar(null)
    })
  }, [])

  // Update bar markers when barsToDisplay changes
  useEffect(() => {
    if (!mapRef.current) return

    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    barsToDisplay.forEach((bar: any) => {
      // Slight random offset for demo
      const offsetLat = 50.6844 + (Math.random() - 0.5) * 0.08
      const offsetLng = 3.1556 + (Math.random() - 0.5) * 0.08

      // Simple emoji marker in SVG
      const markerSVG = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ccircle cx="20" cy="20" r="18" fill="white" stroke="%234285F4" stroke-width="2"/%3E%3Ctext x="20" y="26" text-anchor="middle" font-size="18"%3E${bar.emoji}%3C/text%3E%3C/svg%3E`

      const marker = new google.maps.Marker({
        position: { lat: offsetLat, lng: offsetLng },
        map: mapRef.current,
        title: bar.name,
        icon: markerSVG
      })

      marker.addListener('click', () => {
        setSelectedBar(bar)
      })

      markersRef.current.push(marker)
    })
  }, [barsToDisplay])

  // Calculate opacity overlay based on panel position
  const overlayOpacity = Math.min(panelY / snapPointsPixels.open * 0.4, 0.4)

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* MAP BACKGROUND */}
      <div
        id="google-maps-explore"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'auto'  // Map stays interactive
        }}
      />

      {/* FLOATING FILTERS BUTTON - Correct style with bars and circles */}
      <button
        onClick={() => {
          setPanelY(snapPointsPixels.filters)
          setIsScrollable(false)
        }}
        style={{
          position: 'fixed',
          bottom: '140px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: `3px solid ${COLORS.primary}`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 22,
          transition: 'all 0.2s',
          padding: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        title="Ouvrir les filtres"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top bar: line-circle-line (circle on right) */}
          <line x1="3" y1="6" x2="12" y2="6" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="17" cy="6" r="2.5" fill={COLORS.primary} />
          <line x1="21" y1="6" x2="22" y2="6" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" />

          {/* Middle bar: line-circle-line (circle in center) */}
          <line x1="3" y1="12" x2="10.5" y2="12" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="14" cy="12" r="2.5" fill={COLORS.primary} />
          <line x1="17.5" y1="12" x2="22" y2="12" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" />

          {/* Bottom bar: line-circle-line (circle on left) */}
          <line x1="3" y1="18" x2="4" y2="18" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="7" cy="18" r="2.5" fill={COLORS.primary} />
          <line x1="12" y1="18" x2="22" y2="18" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* OVERLAY - pointerEvents: none pour laisser cliquer la carte */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000000',
          opacity: overlayOpacity,
          zIndex: 5,
          pointerEvents: 'none'
        }}
      />

      {/* DRAGGABLE PANEL - Logique finale avec butées strictes et scroll intégré */}
      <motion.div
        drag="y"
        dragConstraints={{
          top: snapPointsPixels.open,
          bottom: snapPointsPixels.closed
        }}
        dragElastic={0}
        dragMomentum={false}
        dragListener={!isScrollable}
        animate={{ y: panelY }}
        onDragEnd={(event, info) => {
          // Check if it was a horizontal drag (ignore it)
          if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
            return // Horizontal drag - don't snap
          }

          // Recalculer la position exacte du haut du panneau par rapport à la fenêtre
          const currentPanelTop = info.point.y - window.innerHeight
          const closestSnap = getClosestSnapPoint(currentPanelTop)
          
          setPanelY(closestSnap)
          
          // Seuil pour activer le scroll: vraiment en haut
          setIsScrollable(closestSnap <= snapPointsPixels.open + 10)
        }}
        style={{
          position: 'fixed',
          top: '100%',
          left: 0,
          right: 0,
          height: '100vh',
          backgroundColor: '#ffffff',
          borderRadius: '24px 24px 0 0',
          zIndex: 20,
          touchAction: 'none',
          willChange: 'transform',
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.15)',
          pointerEvents: 'auto',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* LA POIGNÉE - Toujours draggable */}
        <div
          onPointerDown={() => setIsScrollable(false)}
          style={{
            padding: '16px 0',
            cursor: 'grab',
            touchAction: 'none',
            display: 'flex',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <div style={{ width: '48px', height: '4px', backgroundColor: '#999', borderRadius: '2px' }} />
        </div>

        {/* LA LISTE - Scrollable quand isScrollable est true */}
        <div
          style={{
            flex: 1,
            overflowY: isScrollable ? 'auto' : 'hidden',
            touchAction: isScrollable ? 'pan-y' : 'none',
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            flexDirection: 'column'
          }}
          onScroll={(e) => {
            if (e.currentTarget.scrollTop <= 0) {
              setIsScrollable(false)
            }
          }}
        >
          {/* SEARCH & CLOSE BUTTON */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', flexShrink: 0, display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                color: '#1a1a1a',
                fontWeight: '500'
              }}
            />
            <button
              onClick={() => {
                setPanelY(snapPointsPixels.closed)
                setIsScrollable(false)
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.borderColor = COLORS.primary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.color = '#333'
                e.currentTarget.style.borderColor = '#e0e0e0'
              }}
              title="Fermer"
            >
              ↓
            </button>
          </div>

          {/* CATEGORIES */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0', overflowX: 'auto', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', minWidth: 'min-content' }}>
              {[
                { id: 'bars', emoji: '🍻', label: 'Bars' },
                { id: 'restos', emoji: '🍽️', label: 'Restos' },
                { id: 'clubs', emoji: '🎵', label: 'Clubs' },
                { id: 'events', emoji: '🎪', label: 'Events' },
                { id: 'other', emoji: '🌍', label: 'Autres' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: selectedCategory === cat.id ? COLORS.primary : '#f0f0f0',
                    color: selectedCategory === cat.id ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FILTERS - Allow horizontal scroll without triggering vertical drag */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0', overflowX: 'auto', flexShrink: 0, touchAction: 'pan-x' }}>
            <div style={{ display: 'flex', gap: '6px', minWidth: 'min-content' }}>
              {FILTERS.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: selectedFilters.includes(filter.id) ? COLORS.primary : '#f0f0f0',
                    color: selectedFilters.includes(filter.id) ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {filter.emoji} {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* RESULTS COUNT */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
              {barsToDisplay.length} résultat{barsToDisplay.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* SCROLLABLE LIST - Only scrolls when panel is at TOP */}
          <div
            style={{
              flex: 1,
              overflow: isScrollable ? 'auto' : 'hidden',
              padding: '16px',
              display: 'grid',
              gap: '12px',
              gridAutoRows: 'min-content'
            }}
          >
            {barsToDisplay.map((bar: any) => (
              <div
                key={bar.id}
                onClick={() => onBarClick(bar)}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ fontSize: '24px' }}>{bar.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{bar.name}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>📍 {bar.distance}km • {bar.location}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onLike(bar.id)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px'
                  }}
                >
                  {likes[bar.id] ? '❤️' : '🤍'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* MINI-FICHE ÉTABLISSEMENT - Flottante sur la carte */}
      {selectedBar && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '20px',
            right: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '16px',
            zIndex: 25,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            border: `2px solid ${COLORS.primary}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
              {selectedBar.profilePhoto && (
                <img
                  src={selectedBar.profilePhoto}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: COLORS.primary }}>{selectedBar.name}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  📍 {selectedBar.distance}km • {selectedBar.location}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedBar(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                color: '#999'
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <a
              href={selectedBar.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: '#4285F4',
                color: 'white',
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              Maps
            </a>
            <a
              href={`tel:${selectedBar.phone}`}
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: COLORS.primary,
                color: 'white',
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              Appel
            </a>
          </div>
        </motion.div>
      )}
    </div>
  )
}
