import { useState, useRef, useEffect } from 'react'
import { BARS } from './data/bars'
import { POSTS } from './data/posts'
import { CATEGORIES } from './data/categories'
import { FILTERS } from './data/filters'
import { COLORS } from './constants/styles'
import { MapTab } from './components/MapTab'
import { SponsorshipBanner } from './components/SponsorshipBanner'
import { DiscoveriesTab } from './components/DiscoveriesTab'
import { FloatingButtons } from './components/FloatingButtons'
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

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('test@example.com')
  const [activeTab, setActiveTab] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFloatingFilter, setActiveFloatingFilter] = useState<string | null>(null)
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({})
  const [likeCount, setLikeCount] = useState<{ [key: number]: number }>({})
  const [selectedBar, setSelectedBar] = useState<any>(null)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [codeInput, setCodeInput] = useState('')
  const [codeVerified, setCodeVerified] = useState(false)
  const [barLikes, setBarLikes] = useState<{ [key: number]: boolean }>({})
  const [barLikeCount, setBarLikeCount] = useState<{ [key: number]: number }>({})
  const [showCelebration, setShowCelebration] = useState(false)

  // Utiliser le hook useFiltering
  const { filteredBars, floatingButtonCounts } = useFiltering({
    bars: BARS,
    searchTerm,
    selectedCategory,
    selectedFilters,
    activeFloatingFilter,
  })

  useEffect(() => {
    const likesCounts: { [key: number]: number } = {}
    BARS.forEach((bar) => {
      likesCounts[bar.id] = parseInt(localStorage.getItem(`bar_likes_${bar.id}`) || '0')
    })
    setLikeCount(likesCounts)
    window.scrollTo(0, 0)
  }, [activeTab])

  const handleLogin = () => {
    setUser({ email, id: 'test' })
  }

  const handleLogout = () => {
    setUser(null)
  }

  const toggleLike = (barId: number) => {
    setLikes((prev) => {
      const newLikes = { ...prev }
      newLikes[barId] = !newLikes[barId]
      return newLikes
    })
    setLikeCount((prev) => {
      const newCount = { ...prev }
      newCount[barId] = (newCount[barId] || 0) + (likes[barId] ? -1 : 1)
      localStorage.setItem(`bar_likes_${barId}`, String(newCount[barId]))
      return newCount
    })
  }

  const toggleBarLike = (barId: number) => {
    setBarLikes((prev) => {
      const newLikes = { ...prev }
      newLikes[barId] = !newLikes[barId]
      return newLikes
    })
    setBarLikeCount((prev) => {
      const newCount = { ...prev }
      newCount[barId] = (newCount[barId] || 0) + (barLikes[barId] ? -1 : 1)
      localStorage.setItem(`bar_profile_likes_${barId}`, String(newCount[barId]))
      return newCount
    })
  }

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId]
    )
  }

  const toggleFloatingFilter = (filter: string | null) => {
    setActiveFloatingFilter(filter)
  }

  const openBarProfile = (bar: any) => {
    setSelectedBar(bar)
  }

  const openPostDetail = (barId: number) => {
    const bar = BARS.find((b) => b.id === barId)
    const post = POSTS.find((p) => p.barId === barId)
    if (bar && post) {
      setSelectedPost({ ...post, bar })
      setCodeInput('')
      setCodeVerified(false)
    }
  }

  const completeOffer = () => {
    setShowCelebration(true)
    setTimeout(() => {
      setShowCelebration(false)
      closeModal()
    }, 3000)
  }

  const closeModal = () => {
    setSelectedBar(null)
    setSelectedPost(null)
  }

  const isCodeCorrect = codeInput.length === 4 && codeInput === selectedPost?.specialOfferCode

  // LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🍻</div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: COLORS.primary, marginBottom: '8px' }}>OUSSA</h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>Quoi faire maintenant? Des idées fraîches, postées en direct</p>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', marginBottom: '16px', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '8px', color: '#1a1a1a', fontSize: '14px', boxSizing: 'border-box' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: COLORS.primary, color: 'white', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Te connecter</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#1a1a1a' }}>
      {/* FLOATING BUTTONS */}
      {activeTab === 'home' && (
        <FloatingButtons 
          counts={floatingButtonCounts}
          activeFilter={activeFloatingFilter}
          onFilterToggle={toggleFloatingFilter}
        />
      )}

      {/* SPONSORSHIP BANNER */}
      {activeTab === 'home' && <SponsorshipBanner sponsors={BARS.filter(b => [1, 2, 21, 3].includes(b.id))} onBarClick={(barId) => openBarProfile(BARS.find(b => b.id === barId)!)} />}

      {/* HEADER */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>📍 Mouvaux</div>
          <div style={{ fontSize: '12px', color: '#666' }}>9:41</div>
        </div>
        {(activeTab === 'home' || activeTab === 'map') && (
          <input type="text" placeholder="Rechercher bars, cafés..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '8px', color: '#1a1a1a', fontSize: '14px', boxSizing: 'border-box' }} />
        )}
      </div>

      {/* CATEGORIES */}
      {(activeTab === 'home' || activeTab === 'map') && (
        <div style={{ borderBottom: '1px solid #e0e0e0', overflowX: 'auto', padding: '12px 0', paddingLeft: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', minWidth: 'min-content' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 16px', backgroundColor: selectedCategory === cat.id ? COLORS.primary : '#f5f5f5', color: selectedCategory === cat.id ? 'white' : '#1a1a1a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FILTERS */}
      {(activeTab === 'home' || activeTab === 'map') && (
        <div style={{ borderBottom: '1px solid #e0e0e0', overflowX: 'auto', padding: '12px 0', paddingLeft: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', minWidth: 'min-content' }}>
            {FILTERS.map((filter) => (
              <button key={filter.id} onClick={() => toggleFilter(filter.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: selectedFilters.includes(filter.id) ? COLORS.primary : '#f5f5f5', color: selectedFilters.includes(filter.id) ? 'white' : '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                <span>{filter.emoji}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS COUNT */}
      {(activeTab === 'home' || activeTab === 'map') && (
        <div style={{ padding: '12px 24px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0', fontSize: '13px', color: '#666', fontWeight: '500' }}>
          {filteredBars.length} résultat{filteredBars.length > 1 ? 's' : ''}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px', paddingBottom: '120px' }}>
        {activeTab === 'home' && (
          <div>
            {filteredBars.map((bar) => {
              const post = POSTS.find((p) => p.barId === bar.id)
              return (
                <div key={bar.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                  {/* CARD HEADER */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => openPostDetail(bar.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); openBarProfile(bar); }}>
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
                        <div style={{ fontSize: '13px', color: '#4CAF50', fontWeight: '600', marginBottom: bar.currentStatus.offreActive || bar.currentStatus.eventActive || bar.currentStatus.happyHourActive ? '6px' : '0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => openPostDetail(bar.id)}>
                          <span className="blink-dot" style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4CAF50' }}></span>
                          PLACES LIBRES EN TERRASSE
                        </div>
                      )}
                      {bar.currentStatus.offreActive && (
                        <div style={{ fontSize: '12px', color: COLORS.accent, fontWeight: '600', marginBottom: bar.currentStatus.eventActive || bar.currentStatus.happyHourActive ? '6px' : '0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => openPostDetail(bar.id)}>
                          🎁 +1 OFFRE SPÉCIALE EN COURS
                          <span style={{ fontSize: '10px' }}>→</span>
                        </div>
                      )}
                      {bar.currentStatus.eventActive && (
                        <div style={{ fontSize: '12px', color: '#9C27B0', fontWeight: '600', marginBottom: bar.currentStatus.happyHourActive ? '6px' : '0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => openPostDetail(bar.id)}>
                          🎪 +1 ÉVÉNEMENT À VENIR
                          <span style={{ fontSize: '10px' }}>→</span>
                        </div>
                      )}
                      {bar.currentStatus.happyHourActive && (
                        <div style={{ fontSize: '12px', color: '#4CAF50', fontWeight: '600', cursor: 'pointer' }} onClick={() => openPostDetail(bar.id)}>
                          ⏰ HAPPY HOUR EN COURS
                        </div>
                      )}
                    </div>
                  )}

                  {/* FILTERS */}
                  <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => openPostDetail(bar.id)}>
                    {bar.filters.map((f) => {
                      const filter = FILTERS.find((opt) => opt.id === f)
                      return filter ? <div key={f} style={{ backgroundColor: '#f0f0f0', color: '#666', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><span>{filter.emoji}</span>{filter.label}</div> : null
                    })}
                  </div>

                  {/* PHOTO */}
                  <div style={{ width: '100%', height: '240px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }} onClick={() => openPostDetail(bar.id)}>
                    {bar.postPhoto ? <img src={bar.postPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📸'}
                  </div>

                  {/* DESCRIPTION */}
                  <div style={{ padding: '12px 16px', fontSize: '13px', color: '#1a1a1a', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => openPostDetail(bar.id)}>
                    {post?.description}
                  </div>

                  {/* FOOTER */}
                  <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '12px', color: '#999' }}>📍 Posté à l'instant</div>
                    <button onClick={() => toggleLike(bar.id)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: likes[bar.id] ? COLORS.primary : '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '20px', transform: likes[bar.id] ? 'scale(1.3)' : 'scale(1)' }}>{likes[bar.id] ? '❤️' : '🤍'}</span>
                      {likeCount[bar.id] || 0}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'map' && <MapTab bars={filteredBars} onBarClick={openBarProfile} />}
        {activeTab === 'discoveries' && <DiscoveriesTab bars={BARS} onBarClick={openBarProfile} />}

        {activeTab === 'profile' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{email.split('@')[0]}</p>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '24px' }}>{email}</p>
            <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: 'white', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Te déconnecter</button>
          </div>
        )}
      </div>

      {/* MODALS */}
      {selectedBar && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }} onClick={closeModal}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px 16px 0 0', padding: '24px', width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{selectedBar.name}</h2>
              <button onClick={closeModal} style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            {selectedBar.profilePhoto && <div style={{ width: '100%', height: '180px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden' }}><img src={selectedBar.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px 0', fontWeight: '500' }}>📍 Localisation</p>
              <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>{selectedBar.location} • {selectedBar.distance}km</p>
              <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px 0', fontWeight: '500' }}>📞 Téléphone</p>
              <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}><a href={`tel:${selectedBar.phone}`} style={{ color: COLORS.primary, textDecoration: 'none' }}>{selectedBar.phone}</a></p>
              <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px 0', fontWeight: '500' }}>📧 Email</p>
              <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}><a href={`mailto:${selectedBar.email}`} style={{ color: COLORS.primary, textDecoration: 'none' }}>{selectedBar.email}</a></p>
              <button onClick={() => toggleBarLike(selectedBar.id)} style={{ width: '100%', padding: '12px', backgroundColor: barLikes[selectedBar.id] ? COLORS.primary : '#f5f5f5', color: barLikes[selectedBar.id] ? 'white' : '#666', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                {barLikes[selectedBar.id] ? '❤️ J\'aime (' + (barLikeCount[selectedBar.id] || 0) + ')' : '🤍 J\'aime (' + (barLikeCount[selectedBar.id] || 0) + ')'}
              </button>
            </div>
            <button onClick={closeModal} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: 'white', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Fermer</button>
          </div>
        </div>
      )}

      {/* OFFER MODAL - Simplifié */}
      {selectedPost && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }} onClick={closeModal}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px 16px 0 0', padding: '24px', width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#1a1a1a' }}>✨ Offre Spéciale</h2>
              <button onClick={closeModal} style={{ backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '24px', padding: 0 }}>✕</button>
            </div>
            {selectedPost.isSpecialOffer ? (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.primary, margin: '0 0 12px 0', lineHeight: '1.4' }}>{selectedPost.offerTitle}</h3>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px 0', lineHeight: '1.6', paddingBottom: '16px', borderBottom: '1px solid #e0e0e0' }}>{selectedPost.offerSubDesc}</p>
                <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', fontSize: '13px', color: '#1a1a1a' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>🎁 Demande le code à ton commerçant</p>
                  <p style={{ margin: 0, color: '#666' }}>pour profiter de l'offre!</p>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '12px', fontWeight: '500' }}>Code 🔐</label>
                  <div style={{ width: '100%', padding: '16px', fontSize: '32px', textAlign: 'center', backgroundColor: '#f9f9f9', color: isCodeCorrect ? '#00aa00' : COLORS.primary, border: '1px solid ' + (isCodeCorrect ? '#00aa00' : '#e0e0e0'), borderRadius: '8px', letterSpacing: '12px', fontWeight: 'bold', marginBottom: '16px', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {codeInput.split('').map((digit, i) => <span key={i} style={{ display: 'inline-block', width: '30px' }}>{digit ? '●' : '○'}</span>)}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button key={num} onClick={() => codeInput.length < 4 && setCodeInput(codeInput + num)} style={{ padding: '10px', fontSize: '14px', fontWeight: '600', backgroundColor: '#f0f0f0', color: '#1a1a1a', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: codeInput.length < 4 ? 'pointer' : 'not-allowed' }}>
                        {num}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' }}>
                    <button onClick={() => codeInput.length < 4 && setCodeInput(codeInput + '0')} style={{ padding: '10px', fontSize: '14px', fontWeight: '600', backgroundColor: '#f0f0f0', color: '#1a1a1a', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer' }}>0</button>
                    <div></div>
                    <button onClick={() => setCodeInput(codeInput.slice(0, -1))} style={{ padding: '10px', fontSize: '14px', fontWeight: '600', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>⌫</button>
                  </div>
                </div>
                <button onClick={completeOffer} disabled={!isCodeCorrect} style={{ width: '100%', padding: '14px', backgroundColor: isCodeCorrect ? COLORS.primary : '#e0e0e0', color: isCodeCorrect ? 'white' : '#999', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: isCodeCorrect ? 'pointer' : 'not-allowed', fontSize: '14px' }}>
                  {isCodeCorrect ? '✅ Valide ton offre (+25 pts)' : 'Valide ton offre'}
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>Établissement</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.primary, margin: '0 0 16px 0' }}>{selectedPost.bar.name}</p>
                <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>Offre</p>
                <p style={{ fontSize: '13px', color: '#1a1a1a', margin: 0 }}>{selectedPost.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CELEBRATION */}
      {showCelebration && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2000 }}>
          {[...Array(30)].map((_, i) => (
            <div key={`confetti-${i}`} className="confetti" style={{ left: `${Math.random() * 100}%`, top: '-10px', width: '10px', height: '10px', backgroundColor: ['FF6B35', 'FFD700', '00aa00', 'FF1493', '00CED1'][i % 5], borderRadius: Math.random() > 0.5 ? '50%' : '2px', animationDelay: `${i * 0.05}s` }} />
          ))}
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: COLORS.primary, color: 'white', padding: '24px 48px', borderRadius: '12px', fontSize: '18px', fontWeight: '700', textAlign: 'center', zIndex: 2001, boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)', animation: 'fadeInScale 0.5s ease-out' }}>
            ✅ Tu as gagné 25 points!
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        {[{ id: 'home', emoji: '🏠', label: 'Accueil' }, { id: 'map', emoji: '🗺️', label: 'Carte' }, { id: 'discoveries', emoji: '✨', label: 'Découvertes' }, { id: 'profile', emoji: '👤', label: 'Profil' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '16px', textAlign: 'center', color: activeTab === tab.id ? COLORS.primary : '#999', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '20px' }}>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
