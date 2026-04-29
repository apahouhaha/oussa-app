import { useState, useRef, useEffect } from 'react'
import { BARS } from './data/bars'
import { POSTS } from './data/posts'
import { CATEGORIES } from './data/categories'
import { FILTERS } from './data/filters'
import { COLORS } from './constants/styles'
import { MapTab } from './components/MapTab'
import { SponsorshipBanner } from './components/SponsorshipBanner'
import { DiscoveriesTab } from './components/DiscoveriesTab'
import { ExploreTab } from './components/ExploreTab'
import { useFiltering } from './hooks/useFiltering'

// Style global pour animations
const heartAnimationStyle = `
  @keyframes heartPulse {
    0% { transform: scale(1); }
    25% { transform: scale(1.3); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  .heart-animation { animation: heartPulse 0.6s ease-in-out; }

  @keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
  }

  @keyframes heart-float {
    0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
    100% { transform: translateY(-150px) translateX(var(--tx, 0px)) scale(0); opacity: 0; }
  }

  .confetti {
    position: fixed;
    pointer-events: none;
    animation: confetti-fall 2.5s ease-in forwards;
  }

  @keyframes fadeInScale {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0.3; }
  }

  .blink-dot {
    animation: blink 1.2s infinite;
  }
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = heartAnimationStyle
  document.head.appendChild(style)
}

// Composant Card réutilisable pour NOW et EXPLORE
function BarCard({ bar, post, likes, likeCount, onLike, onBarClick, onPostClick, hasPhoto = true, onEventClick }: any) {
  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
      {/* CARD HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={onPostClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onBarClick(bar); }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', overflow: 'hidden' }}>
            {bar.profilePhoto ? <img src={bar.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : bar.emoji}
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{bar.name}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>📍 {bar.distance}km • {bar.location}</div>
          </div>
        </div>
      </div>

      {/* REAL-TIME STATUS */}
      {(bar.currentStatus.terrasseDispo || bar.currentStatus.offreActive || bar.currentStatus.eventActive || bar.currentStatus.happyHourActive) && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          {bar.currentStatus.terrasseDispo && (
            <div style={{ fontSize: '13px', color: '#4CAF50', fontWeight: '600', marginBottom: bar.currentStatus.offreActive || bar.currentStatus.eventActive || bar.currentStatus.happyHourActive ? '6px' : '0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={onPostClick}>
              <span className="blink-dot" style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4CAF50' }}></span>
              PLACES LIBRES EN TERRASSE
            </div>
          )}
          {bar.currentStatus.offreActive && (
            <div style={{ fontSize: '12px', color: COLORS.accent, fontWeight: '600', marginBottom: bar.currentStatus.eventActive || bar.currentStatus.happyHourActive ? '6px' : '0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={onPostClick}>
              🎁 +1 OFFRE SPÉCIALE EN COURS
              <span style={{ fontSize: '10px' }}>→</span>
            </div>
          )}
          {bar.currentStatus.eventActive && (
            <div style={{ fontSize: '12px', color: '#9C27B0', fontWeight: '600', marginBottom: bar.currentStatus.happyHourActive ? '6px' : '0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => onEventClick?.(bar.id)}>
              🎪 +1 ÉVÉNEMENT À VENIR
              <span style={{ fontSize: '10px' }}>→</span>
            </div>
          )}
          {bar.currentStatus.happyHourActive && (
            <div style={{ fontSize: '12px', color: '#4CAF50', fontWeight: '600', cursor: 'pointer' }} onClick={onPostClick}>
              ⏰ HAPPY HOUR EN COURS
            </div>
          )}
        </div>
      )}

      {/* POST CONTENT - SANS PHOTO */}
      {post && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          {post.postText && (
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#333', lineHeight: '1.5' }}>
              {post.postText}
            </p>
          )}
          {post.discountCode && (
            <div style={{ backgroundColor: COLORS.accent, color: 'white', padding: '8px 12px', borderRadius: '6px', fontWeight: '700', textAlign: 'center', fontSize: '14px', marginBottom: '8px' }}>
              Code: {post.discountCode}
            </div>
          )}
          {post.type === 'event' && (
            <div style={{ backgroundColor: '#f0e6ff', color: '#9C27B0', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
              🎪 Événement à venir
            </div>
          )}
        </div>
      )}

      {/* LIKE BUTTON */}
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#999' }}>{likeCount[bar.id] || 0} aime{(likeCount[bar.id] || 0) > 1 ? 's' : ''}</span>
        <button
          onClick={() => onLike(bar.id)}
          style={{
            backgroundColor: likes[bar.id] ? COLORS.primary : '#f5f5f5',
            color: likes[bar.id] ? 'white' : '#666',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
          className={likes[bar.id] ? 'heart-animation' : ''}
        >
          {likes[bar.id] ? '❤️ Aimé' : '🤍 Aimer'}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('now')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFloatingFilter, setActiveFloatingFilter] = useState<string | null>(null)
  const [likes, setLikes] = useState<Record<number, boolean>>({})
  const [likeCount, setLikeCount] = useState<Record<number, number>>({
    1: 48, 2: 92, 3: 156, 21: 73, 4: 45, 5: 67, 6: 34, 7: 89, 8: 52, 9: 120,
    10: 41, 11: 78, 12: 95, 13: 63, 14: 84, 15: 109, 16: 56, 17: 71, 18: 88, 19: 102,
    20: 67, 22: 92, 23: 55, 24: 74, 25: 81, 26: 98, 27: 47, 28: 65, 29: 79, 30: 113,
    31: 58, 32: 91, 33: 66, 34: 85, 35: 107, 36: 49, 37: 72, 38: 89, 39: 104, 40: 62,
    41: 76, 42: 93, 43: 57, 44: 82, 45: 99, 46: 51, 47: 69, 48: 86, 49: 110, 50: 64
  })
  const [selectedPostDetail, setSelectedPostDetail] = useState<any>(null)
  const [selectedBarProfile, setSelectedBarProfile] = useState<any>(null)
  const [photoCarouselIndex, setPhotoCarouselIndex] = useState(0)

  // Logique filtrage EXPLORE
  const filteredBars = useFiltering({
    bars: BARS,
    searchTerm,
    selectedCategory,
    selectedFilters,
    activeFloatingFilter: null // EXPLORE n'utilise pas de filtre flottant
  }).filteredBars

  // Logique pour NOW: filtrer les bars avec statuts temps réel
  let barsWithRealTimeStatus = BARS.filter(b => 
    b.currentStatus.terrasseDispo || 
    b.currentStatus.offreActive || 
    b.currentStatus.eventActive || 
    b.currentStatus.happyHourActive
  )

  // Appliquer le filtre flottant sélectionné
  if (activeFloatingFilter) {
    barsWithRealTimeStatus = barsWithRealTimeStatus.filter(b => {
      if (activeFloatingFilter === 'terrasse') return b.currentStatus.terrasseDispo
      if (activeFloatingFilter === 'offre') return b.currentStatus.offreActive
      if (activeFloatingFilter === 'event') return b.currentStatus.eventActive
      if (activeFloatingFilter === 'happyHour') return b.currentStatus.happyHourActive
      return true
    })
  }

  // Tri: si filtre "offre" actif, les offres en premier, sinon terrasse dispo en priorité
  barsWithRealTimeStatus = barsWithRealTimeStatus.sort((a, b) => {
    if (activeFloatingFilter === 'offre') {
      const aOffer = a.currentStatus.offreActive ? 0 : 1
      const bOffer = b.currentStatus.offreActive ? 0 : 1
      if (aOffer !== bOffer) return aOffer - bOffer
    } else {
      const aTerrasse = a.currentStatus.terrasseDispo ? 0 : 1
      const bTerrasse = b.currentStatus.terrasseDispo ? 0 : 1
      if (aTerrasse !== bTerrasse) return aTerrasse - bTerrasse
    }
    return a.distance - b.distance
  })

  const toggleLike = (barId: number) => {
    setLikes(prev => ({
      ...prev,
      [barId]: !prev[barId]
    }))
    setLikeCount(prev => ({
      ...prev,
      [barId]: (prev[barId] || 0) + (likes[barId] ? -1 : 1)
    }))
  }

  const openBarProfile = (bar: any) => {
    setSelectedBarProfile(bar)
  }

  const closeBarProfile = () => {
    setSelectedBarProfile(null)
  }

  const openPostDetail = (barId: number) => {
    const post = POSTS.find(p => p.barId === barId)
    if (post) {
      setSelectedPostDetail(post)
    }
  }

  const closePostDetail = () => {
    setSelectedPostDetail(null)
  }

  const openEventPost = (barId: number) => {
    const eventPost = POSTS.find(p => p.barId === barId && p.type === 'event')
    if (eventPost) {
      setSelectedPostDetail(eventPost)
    }
  }

  // UI
  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* MODALS */}
      {selectedPostDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxHeight: '90vh', borderRadius: '20px 20px 0 0', overflow: 'auto', animation: 'fadeInScale 0.3s ease-out' }}>
            <div style={{ padding: '20px', position: 'sticky', top: 0, backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Détail du post</h2>
              <button onClick={closePostDetail} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            {selectedPostDetail.postPhoto && (
              <div style={{ width: '100%', height: '300px', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                <img src={selectedPostDetail.postPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6', marginBottom: '12px' }}>{selectedPostDetail.postText}</p>
              {selectedPostDetail.discountCode && (
                <div style={{ backgroundColor: COLORS.accent, color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '700', textAlign: 'center', marginBottom: '12px' }}>
                  Code: {selectedPostDetail.discountCode}
                </div>
              )}
              {selectedPostDetail.type === 'event' && (
                <div style={{ backgroundColor: '#f0e6ff', color: '#9C27B0', padding: '12px', borderRadius: '8px', fontWeight: '600', textAlign: 'center' }}>
                  🎪 {selectedPostDetail.eventName || 'Événement'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedBarProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxHeight: '90vh', borderRadius: '20px 20px 0 0', overflow: 'auto' }}>
            <div style={{ padding: '20px', position: 'sticky', top: 0, backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Profil établissement</h2>
              <button onClick={closeBarProfile} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f5f5f5', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', overflow: 'hidden' }}>
                  {selectedBarProfile.profilePhoto ? <img src={selectedBarProfile.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : selectedBarProfile.emoji}
                </div>
                <h1 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>{selectedBarProfile.name}</h1>
                <p style={{ margin: '0 0 12px 0', color: '#999', fontSize: '14px' }}>{selectedBarProfile.location}</p>
              </div>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>Découvrez cet établissement avec tous ses services et ses avantages.</p>
              <button 
                onClick={() => toggleLike(selectedBarProfile.id)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  backgroundColor: likes[selectedBarProfile.id] ? COLORS.primary : '#f5f5f5', 
                  color: likes[selectedBarProfile.id] ? 'white' : '#666', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: '600', 
                  cursor: 'pointer' 
                }}
              >
                {likes[selectedBarProfile.id] ? '❤️ Vous aimez' : '🤍 Aimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ backgroundColor: '#ffffff', padding: '12px 24px', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>OUSSA</h1>
            <span style={{ fontSize: '24px' }}>📍</span>
          </div>
        </div>

      {/* FLOATING BUTTONS - NOW TAB */}
        {activeTab === 'now' && (
          <div style={{ padding: '12px 24px', borderBottom: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { id: 'terrasse', emoji: '🏖️', label: 'Terrasse libre', color: '#FF6B35' },
                { id: 'offre', emoji: '🎁', label: 'Offres Spéciales', color: '#DAA520' },
                { id: 'event', emoji: '🎪', label: 'Événement', color: '#9C27B0' },
                { id: 'happyHour', emoji: '⏰', label: 'Happy hour', color: '#4CAF50' }
              ].map(btn => (
                <div key={btn.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => setActiveFloatingFilter(activeFloatingFilter === btn.id ? null : btn.id)}>
                  <button
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: activeFloatingFilter === btn.id ? btn.color : '#ffffff',
                      border: `3px solid ${activeFloatingFilter === btn.id ? btn.color : '#e0e0e0'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '20px',
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {btn.emoji}
                  </button>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#666', textAlign: 'center', maxWidth: '60px' }}>
                    {btn.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS COUNT */}
        {activeTab === 'now' && (
          <div style={{ padding: '12px 24px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0', fontSize: '13px', color: '#666', fontWeight: '500' }}>
            {barsWithRealTimeStatus.length} actu{barsWithRealTimeStatus.length > 1 ? 's' : ''} en temps réel
          </div>
        )}

        {/* TABS CONTENT */}
        {/* NOW TAB */}
        {activeTab === 'now' && (
          <div style={{ padding: '12px 24px' }}>
            {barsWithRealTimeStatus.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#999' }}>
                <p>Aucune actu en temps réel</p>
                <p style={{ fontSize: '12px', marginTop: '12px' }}>Voici les établissements les plus populaires</p>
              </div>
            ) : (
              barsWithRealTimeStatus.map((bar) => {
                const post = POSTS.find((p) => p.barId === bar.id)
                return (
                  <BarCard
                    key={bar.id}
                    bar={bar}
                    post={post}
                    likes={likes}
                    likeCount={likeCount}
                    onLike={toggleLike}
                    onBarClick={openBarProfile}
                    onPostClick={() => openPostDetail(bar.id)}
                    onEventClick={openEventPost}
                    hasPhoto={false}
                  />
                )
              })
            )}
          </div>
        )}

      {/* EXPLORE TAB - Draggable BottomSheet + Map - FULLSCREEN */}
        {activeTab === 'explore' && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
            <ExploreTab 
              filteredBars={BARS}
              likes={likes}
              likeCount={likeCount}
              onLike={toggleLike}
              onBarClick={openBarProfile}
            />
          </div>
        )}

        {/* À LA UNE TAB */}
        {activeTab === 'featured' && (
          <div style={{ padding: '12px 24px' }}>
            {BARS.filter(b => [1, 2, 21, 3].includes(b.id)).map((bar) => {
              const barPosts = POSTS.filter(p => p.barId === bar.id && p.postPhoto)
              return (
                <div key={bar.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', border: '3px solid #DAA520', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                  {/* SPONSOR BADGE */}
                  <div style={{ padding: '12px 16px', backgroundColor: '#fffcf0', borderBottom: '1px solid #DAA520', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>⭐</span>
                    <span style={{ fontWeight: '700', color: '#DAA520', fontSize: '14px' }}>PARTENAIRE OUSSA</span>
                  </div>

                  {/* AVATAR */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', overflow: 'hidden', flexShrink: 0 }}>
                      {bar.profilePhoto ? <img src={bar.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : bar.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>{bar.name}</div>
                      <div style={{ fontSize: '13px', color: '#999' }}>📍 {bar.location} • {bar.distance}km</div>
                    </div>
                  </div>

                  {/* PHOTO CAROUSEL */}
                  {barPosts.length > 0 && (
                    <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                      <img src={barPosts[photoCarouselIndex].postPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {barPosts.length > 1 && (
                        <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                          {photoCarouselIndex + 1} / {barPosts.length}
                        </div>
                      )}
                    </div>
                  )}

                  {/* DESCRIPTION */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                      {bar.emoji} Établissement premium présenté par OUSSA. Découvrez une expérience unique dans une ambiance conviviale et accueillante. Venez profiter de nos services et de notre hospitalité.
                    </p>
                  </div>

                  {/* FILTERS */}
                  <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #f0f0f0' }}>
                    {bar.filters.map((f) => {
                      const filter = FILTERS.find((opt) => opt.id === f)
                      return filter ? <div key={f} style={{ backgroundColor: '#f0f0f0', color: '#666', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><span>{filter.emoji}</span>{filter.label}</div> : null
                    })}
                  </div>

                  {/* CTA */}
                  <div style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => openBarProfile(bar)}
                      style={{ flex: 1, padding: '12px', backgroundColor: COLORS.primary, color: 'white', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
                    >
                      Voir la fiche
                    </button>
                    <button 
                      onClick={() => toggleLike(bar.id)}
                      style={{ padding: '12px 16px', backgroundColor: likes[bar.id] ? COLORS.primary : '#f5f5f5', color: likes[bar.id] ? 'white' : '#666', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
                    >
                      {likes[bar.id] ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* PROFIL TAB */}
        {activeTab === 'profile' && (
          <div style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f5f5f5', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>👤</div>
              <h2 style={{ margin: '0 0 4px 0' }}>Utilisateur OUSSA</h2>
              <p style={{ color: '#999', margin: 0 }}>Profil local</p>
            </div>
            <button style={{ width: '100%', padding: '12px', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#d32f2f' }}>
              Se déconnecter
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM TABS */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #e0e0e0', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '8px 0' }}>
          {[
            { id: 'now', emoji: '⚡', label: 'Now' },
            { id: 'explore', emoji: '🗺️', label: 'Explore' },
            { id: 'featured', emoji: '⭐', label: 'À la une' },
            { id: 'profile', emoji: '👤', label: 'Profil' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? COLORS.primary : 'transparent',
                color: activeTab === tab.id ? 'white' : '#999',
                border: 'none',
                padding: '8px 0',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '600',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
