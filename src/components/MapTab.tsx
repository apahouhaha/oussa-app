import { useEffect, useRef, useState, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BARS } from '../data/bars'

interface MapTabProps {
  selectedCategory: string | null
  selectedFilters: string[]
}

interface BarWithCoords {
  bar: typeof BARS[0]
  lat: number
  lng: number
}

export function MapTab({ selectedCategory, selectedFilters }: MapTabProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const [selectedBar, setSelectedBar] = useState<any>(null)
  const [currentZoom, setCurrentZoom] = useState(13)
  const markersRef = useRef<{ [key: number]: L.Marker }>({})
  const labelsRef = useRef<{ [key: number]: L.Marker }>({})
  const coordsRef = useRef<{ [key: number]: { lat: number; lng: number } }>({})

  // Reset le selectedBar quand on quitte le MapTab
  useEffect(() => {
    return () => {
      setSelectedBar(null)
    }
  }, [])
  const barsWithCoords = useMemo(() => {
    return BARS.map((bar) => {
      if (!coordsRef.current[bar.id]) {
        coordsRef.current[bar.id] = {
          lat: 50.6979 + (Math.random() - 0.5) * 0.08,
          lng: 3.1349 + (Math.random() - 0.5) * 0.08,
        }
      }
      return {
        bar,
        lat: coordsRef.current[bar.id].lat,
        lng: coordsRef.current[bar.id].lng,
      }
    })
  }, [])

  // Filtrer les bars
  const filteredBars = useMemo(() => {
    return barsWithCoords.filter(({ bar }) => {
      if (selectedCategory && bar.category !== selectedCategory) return false
      const normalFilters = selectedFilters.filter(f => f !== 'offers')
      if (normalFilters.length > 0 && !normalFilters.every((f) => bar.filters.includes(f))) return false
      return true
    })
  }, [selectedCategory, selectedFilters, barsWithCoords])

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current) return

    map.current = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([50.6979, 3.1349], 13)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map.current)

    // Ajouter localisation utilisateur avec aura directionnelle (90 degrés)
    const userIcon = L.divIcon({
      html: `
        <!-- Aura bleue de 90 degrés (orientation nord) -->
        <svg style="
          position: absolute;
          width: 60px;
          height: 60px;
          filter: drop-shadow(0 0 8px rgba(66, 133, 244, 0.4));
          margin-left: -30px;
          margin-top: -30px;
        " viewBox="0 0 60 60">
          <defs>
            <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4285F4;stop-opacity:0.4" />
              <stop offset="100%" style="stop-color:#4285F4;stop-opacity:0" />
            </linearGradient>
          </defs>
          <!-- Secteur de 90 degrés (quart de cercle) orienté vers le haut -->
          <path d="M 30 30 L 30 5 A 25 25 0 0 1 55 30 Z" fill="url(#auraGradient)" />
        </svg>
        
        <!-- Point bleu central -->
        <div style="
          position: relative;
          width: 16px;
          height: 16px;
          background: #4285F4;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(66, 133, 244, 0.6);
          z-index: 10;
          margin-left: -8px;
          margin-top: -8px;
        "></div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    })

    L.marker([50.6979, 3.1349], { icon: userIcon, title: 'Ma position' }).addTo(map.current)

    // Écouter les changements de zoom
    const handleZoom = () => {
      if (map.current) {
        setCurrentZoom(map.current.getZoom())
      }
    }

    map.current.on('zoom', handleZoom)

    return () => {
      if (map.current) {
        map.current.off('zoom', handleZoom)
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Ajouter/mettre à jour les marqueurs
  useEffect(() => {
    if (!map.current) return

    // Supprimer les anciens marqueurs
    Object.values(markersRef.current).forEach((marker) => {
      map.current?.removeLayer(marker)
    })
    Object.values(labelsRef.current).forEach((label) => {
      map.current?.removeLayer(label)
    })
    markersRef.current = {}
    labelsRef.current = {}

    // Ajouter les nouveaux marqueurs
    filteredBars.forEach(({ bar, lat, lng }) => {
      const marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMEMxMi4wOCAwIDkgMy4wOCA5IDcuMkM5IDEyLjk2IDE2IDI0IDE2IDI0UzIzIDE2IDIzIDcuMkMyMyAzLjA4IDE5LjkyIDAgMTYgMFoiIGZpbGw9IiNGRjZCMzUiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjEyIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
          iconSize: [32, 48],
          iconAnchor: [16, 48],
        }),
        title: bar.name,
      }).addTo(map.current!)

      marker.on('click', () => {
        setSelectedBar(bar)
        
        // Ajouter un label au clic (même si zoom < 15)
        Object.values(labelsRef.current).forEach((label) => {
          map.current?.removeLayer(label)
        })
        labelsRef.current = {}

        // Afficher le label de ce bar
        const clickedLabel = L.marker([lat, lng], {
          icon: L.divIcon({
            html: `<div style="
              background: rgba(255, 255, 255, 0.95);
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              color: #FF6B35;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
              pointer-events: none;
            ">${bar.name}</div>`,
            iconSize: [100, 24],
            iconAnchor: [50, 20],
            className: 'bar-label',
          }),
        }).addTo(map.current!)

        labelsRef.current[bar.id] = clickedLabel

        setTimeout(() => {
          detailsRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      })

      markersRef.current[bar.id] = marker

      // Ajouter le label si zoom suffisant (zoom >= 15)
      if (currentZoom >= 15) {
        const label = L.marker([lat, lng], {
          icon: L.divIcon({
            html: `<div style="
              background: rgba(255, 255, 255, 0.95);
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              color: #FF6B35;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
              pointer-events: none;
            ">${bar.name}</div>`,
            iconSize: [100, 24],
            iconAnchor: [50, 20],
            className: 'bar-label',
          }),
        }).addTo(map.current!)

        labelsRef.current[bar.id] = label
      }
    })
  }, [filteredBars, currentZoom])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
      {/* Carte minimaliste */}
      <div
        ref={mapContainer}
        style={{
          height: '300px',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '16px',
          border: '1px solid #e0e0e0',
          backgroundColor: '#f0f0f0',
        }}
      />

      {/* Infos détaillées - scroll en bas par défaut uniquement sur cet onglet */}
      <div ref={detailsRef}>
        {selectedBar ? (
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: '#FF6B35' }}>
                  {selectedBar.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                  📍 {selectedBar.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedBar(null)}
                style={{
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', marginBottom: '12px' }}>
              <div>
                <p style={{ color: '#999', margin: '0 0 4px 0' }}>📞</p>
                <a href={`tel:${selectedBar.phone}`} style={{ margin: 0, color: '#FF6B35', fontSize: '11px', textDecoration: 'none', fontWeight: '600', cursor: 'pointer' }}>
                  {selectedBar.phone}
                </a>
              </div>
              <div>
                <p style={{ color: '#999', margin: '0 0 4px 0' }}>📧</p>
                <a href={`mailto:${selectedBar.email}`} style={{ margin: 0, color: '#FF6B35', fontSize: '11px', textDecoration: 'none', fontWeight: '600', cursor: 'pointer' }}>
                  {selectedBar.email}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href={selectedBar.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '11px',
                  fontWeight: '600',
                }}
              >
                Site
              </a>
              <a
                href={selectedBar.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#E4405F',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '11px',
                  fontWeight: '600',
                }}
              >
                Instagram
              </a>
              <a
                href={selectedBar.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#4285F4',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '11px',
                  fontWeight: '600',
                }}
              >
                Maps
              </a>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '24px', fontSize: '14px' }}>
            Clique sur une épingle pour voir les détails
          </div>
        )}
      </div>
    </div>
  )
}
