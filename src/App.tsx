import { useState, useRef, useEffect } from 'react'

// ===== IMPORTS DES FICHIERS MODULAIRES =====
import { FILTERS } from './data/filters'
import { CATEGORIES } from './data/categories'
import { BARS } from './data/bars'
import { POSTS } from './data/posts'
import { COLORS } from './constants/styles'
import { useHeartAnimation } from './hooks/useHeartAnimation'
import { HEART_ANIMATIONS_CSS } from './constants/heartAnimations'

// Style global pour l'animation du coeur
const heartAnimationStyle = `
  @keyframes heartPulse {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.3);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .heart-animation {
    animation: heartPulse 0.6s ease-in-out;
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(600px) rotate(720deg);
      opacity: 0;
    }
  }

  @keyframes heart-float {
    0% {
      transform: translateY(0) translateX(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-150px) translateX(var(--tx, ${Math.random() * 100 - 50}px)) scale(0);
      opacity: 0;
    }
  }

    /* ===== NOUVELLE ANIMATION COEUR SPECTACULAIRE ===== */
      @keyframes floatHearts {
          0% {
                opacity: 1;
                      transform: translateY(0) scale(1);
                            filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.8));
                                }
                                    50% {
                                          filter: drop-shadow(0 0 20px rgba(255, 107, 53, 1));
                                              }
                                                  100% {
                                                        opacity: 0;
                                                              transform: translateY(-100vh) scale(0.5);
                                                                    filter: drop-shadow(0 0 5px rgba(255, 107, 53, 0.2));
                                                                        }
                                                                          }

                                                                            .heart-float {
                                                                                position: fixed;
                                                                                    font-size: 32px;
                                                                                        font-weight: bold;
                                                                                            z-index: 9999;
                                                                                                pointer-events: none;
                                                                                                    user-select: none;
                                                                                                        animation: floatHearts 2s ease-out forwards;
                                                                                                                left: 50%;
                                                                                                                    bottom: 20px;
                                                                                                                        transform: translateX(-50%);
                                                                                                                          }

                                                                                                                            .heart-float-1 { animation-delay: 0ms; }
                                                                                                                              .heart-float-2 { animation-delay: 100ms; }
                                                                                                                                .heart-float-3 { animation-delay: 200ms; }

  .confetti {
    position: fixed;
    pointer-events: none;
    animation: confetti-fall 2.5s ease-in forwards;
  }
`

// Injecter les styles
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
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({})
  const [likeCount, setLikeCount] = useState<{ [key: number]: number }>({})
  const [selectedBar, setSelectedBar] = useState<any>(null)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [codeInput, setCodeInput] = useState('')
  const [codeVerified, setCodeVerified] = useState(false)
  const [barLikes, setBarLikes] = useState<{ [key: number]: boolean }>({})
  const [barLikeCount, setBarLikeCount] = useState<{ [key: number]: number }>({})
  const [showCelebration, setShowCelebration] = useState(false)
  const { floatingHearts, createHearts } = useHeartAnimation()

  useEffect(() => {
    const likesCounts: { [key: number]: number } = {}
    BARS.forEach((bar) => {
      likesCounts[bar.id] = parseInt(localStorage.getItem(`bar_likes_${bar.id}`) || '0')
    })
    setLikeCount(likesCounts)
  }, [])

  const handleLogin = () => {
    setUser({ email, id: 'test' })
  }

  const handleLogout = () => {
    setUser(null)
  }

  const toggleLike = (barId: number, clickX?: number, clickY?: number) => {
  const newLiked = !likes[barId]
  
  setLikes((prev) => {
    const newLikes = { ...prev }
    newLikes[barId] = newLiked
    return newLikes
  })
  
  setLikeCount((prev) => {
    const newCount = { ...prev }
    newCount[barId] = (newCount[barId] || 0) + (newLiked ? 1 : -1)
    localStorage.setItem(`bar_likes_${barId}`, String(newCount[barId]))
    return newCount
  })

  // ===== ANIMATION COEUR SPECTACULAIRE =====
  if (newLiked && clickX && clickY) {
    createHearts(clickX, clickY)
  }
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

  const filteredBars = BARS.filter((bar) => {
    if (selectedCategory && bar.category !== selectedCategory) return false

    // Vérifier les filtres "normaux"
    const normalFilters = selectedFilters.filter(f => f !== 'offers')
    if (normalFilters.length > 0 && !normalFilters.every((f) => bar.filters.includes(f))) return false

    // Vérifier le filtre "Offres spéciales" dans POSTS
    if (selectedFilters.includes('offers')) {
      const hasOffer = POSTS.some(post => post.barId === bar.id && post.isSpecialOffer)
      if (!hasOffer) return false
    }

    return true
  }).sort((a, b) => a.distance - b.distance)

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
    // Afficher l'animation au lieu de l'alert
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

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🍻</div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#FF6B35', marginBottom: '8px' }}>OUSSA</h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>Quoi faire maintenant? Des idées fraîches, postées en direct</p>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', marginBottom: '16px', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '8px', color: '#1a1a1a', fontSize: '14px', boxSizing: 'border-box' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Te connecter</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#1a1a1a' }}>
      {/* HEADER MINIMALISTE */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>📍 Mouvaux</div>
          <div style={{ fontSize: '12px', color: '#666' }}>9:41</div>
        </div>
        <input type="text" placeholder="Rechercher bars, cafés..." style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '8px', color: '#1a1a1a', fontSize: '14px', boxSizing: 'border-box' }} />
      </div>

      {/* CATEGORIES SCROLL HORIZONTAL */}
      <div style={{ borderBottom: '1px solid #e0e0e0', overflowX: 'auto', padding: '12px 0', paddingLeft: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', minWidth: 'min-content' }}>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 16px', backgroundColor: selectedCategory === cat.id ? '#FF6B35' : '#f5f5f5', color: selectedCategory === cat.id ? 'white' : '#1a1a1a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FILTRES SCROLL HORIZONTAL */}
      <div style={{ borderBottom: '1px solid #e0e0e0', overflowX: 'auto', padding: '12px 0', paddingLeft: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', minWidth: 'min-content' }}>
          {FILTERS.map((filter) => (
            <button key={filter.id} onClick={() => toggleFilter(filter.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: selectedFilters.includes(filter.id) ? '#FF6B35' : '#f5f5f5', color: selectedFilters.includes(filter.id) ? 'white' : '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              <span>{filter.emoji}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* COMPTEUR RÉSULTATS */}
      <div style={{ padding: '12px 24px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0', fontSize: '13px', color: '#666', fontWeight: '500' }}>
        {filteredBars.length} résultat{filteredBars.length > 1 ? 's' : ''}
      </div>

      {/* CONTENU PRINCIPAL */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px', paddingBottom: '120px' }}>
        {activeTab === 'home' && (
          <div>
            {filteredBars.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#999' }}>
                <p>Aucun établissement ne correspond à ta recherche</p>
              </div>
            ) : (
              filteredBars.map((bar) => {
                const post = POSTS.find((p) => p.barId === bar.id)
                return (
                  <div key={bar.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', border: '1px solid #e0e0e0', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                    {/* HEADER CARD - Avatar cliquable séparément */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }} onClick={() => openPostDetail(bar.id)}>
                      {/* Avatar - cliquable pour profil */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); openBarProfile(bar); }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', overflow: 'hidden' }}>
                          {bar.profilePhoto ? <img src={bar.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : bar.emoji}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>{bar.name}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>📍 {bar.distance}km • {bar.location}</div>
                        </div>
                      </div>
                      {post?.isSpecialOffer && (
                        <div style={{ backgroundColor: '#ffffff', color: '#FF6B35', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '12px', border: '2px solid #FF6B35' }}>
                          🎁 OFFRE SPÉCIALE
                        </div>
                      )}
                    </div>

                    {/* FILTRES TAGS */}
                    <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => openPostDetail(bar.id)}>
                      {bar.filters.map((f) => {
                        const filter = FILTERS.find((opt) => opt.id === f)
                        return filter ? (
                          <div key={f} style={{ backgroundColor: '#f0f0f0', color: '#666', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>{filter.emoji}</span>
                            {filter.label}
                          </div>
                        ) : null
                      })}
                    </div>

                    {/* IMAGE POST */}
                    <div style={{ width: '100%', height: '240px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }} onClick={() => openPostDetail(bar.id)}>
                      {bar.postPhoto ? <img src={bar.postPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📸'}
                    </div>

                    {/* DESCRIPTION */}
                    <div style={{ padding: '12px 16px', fontSize: '13px', color: '#1a1a1a', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => openPostDetail(bar.id)}>
                      {post?.description}
                    </div>

                    {/* DÉCOMPTE OFFRE (si offre spéciale) */}
                    {post?.isSpecialOffer && (
                      <div style={{ padding: '8px 16px', backgroundColor: '#fff9e6', borderBottom: '1px solid #f0f0f0', fontSize: '12px', color: '#FF6B35', fontWeight: '500', textAlign: 'center', cursor: 'pointer' }} onClick={() => openPostDetail(bar.id)}>
                        ⏱️ Valable jusqu'à 20h30 aujourd'hui
                      </div>
                    )}

                    {/* FOOTER */}
                    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#999', cursor: 'pointer', flex: 1 }} onClick={() => openPostDetail(bar.id)}>📍 Posté à l'instant</div>
                      <button onClick={(e) => {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  toggleLike(bar.id, rect.left + rect.width / 2, rect.top + rect.height / 2)
}} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: likes[bar.id] ? '#FF6B35' : '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                        <span style={{ fontSize: '20px', display: 'inline-block', transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', transform: likes[bar.id] ? 'scale(1.3) rotate(0deg)' : 'scale(1)', filter: likes[bar.id] ? 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.6))' : 'none' }}>
                          {likes[bar.id] ? '❤️' : '🤍'}
                        </span>
                        {likeCount[bar.id] || 0}
                        {/* Coeurs flottants au like */}
                        {floatingHearts.map((heart, idx) => (
  <div 
    key={heart.id} 
    className={`heart-float heart-float-${(idx % 7) + 1}`}
    style={{
      left: `${heart.startX}px`,
      top: `${heart.startY}px`,
      fontSize: `${heart.size}px`,
    }}
  >
    ❤️
  </div>
))}
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{email.split('@')[0]}</p>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '24px' }}>{email}</p>
            <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Te déconnecter</button>
          </div>
        )}
      </div>

      {/* MODALES - Profil */}
      {selectedBar && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }} onClick={closeModal}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px 16px 0 0', padding: '24px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{selectedBar.name}</h2>
              <button onClick={closeModal} style={{ backgroundColor: '#f5f5f5', color: '#666', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            {selectedBar.profilePhoto && (
              <div style={{ width: '100%', height: '180px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden' }}>
                <img src={selectedBar.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>📍 Localisation</p>
              <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>{selectedBar.location} • {selectedBar.distance}km</p>

              <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>📞 Téléphone</p>
              <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>{selectedBar.phone}</p>

              <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>📧 Email</p>
              <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>{selectedBar.email}</p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <a href={selectedBar.website} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FF6B35', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: '600' }}>Site Web</a>
                <a href={selectedBar.instagram} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#E4405F', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: '600' }}>Instagram</a>
                <a href={selectedBar.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#4285F4', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: '600' }}>Maps</a>
              </div>

              <button onClick={() => toggleBarLike(selectedBar.id)} style={{ width: '100%', padding: '12px', backgroundColor: barLikes[selectedBar.id] ? '#FF6B35' : '#f5f5f5', color: barLikes[selectedBar.id] ? 'white' : '#666', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}>
                {barLikes[selectedBar.id] ? '❤️ J\'aime (' + (barLikeCount[selectedBar.id] || 0) + ')' : '🤍 J\'aime (' + (barLikeCount[selectedBar.id] || 0) + ')'}
              </button>
            </div>

            <button onClick={closeModal} style={{ width: '100%', padding: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Fermer</button>
          </div>
        </div>
      )}

      {/* MODALES - Détail Post ÉPURÉ */}
      {selectedPost && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }} onClick={closeModal}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px 16px 0 0', padding: '24px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#1a1a1a' }}>
                {selectedPost.isSpecialOffer ? '✨ Offre Spéciale' : 'Détail'}
              </h2>
              <button onClick={closeModal} style={{ backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '24px', padding: 0 }}>✕</button>
            </div>

            {selectedPost.isSpecialOffer ? (
              <div>
                {/* Titre offre - simple et épuré */}
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FF6B35', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                  {selectedPost.offerTitle}
                </h3>

                {/* Sous-description - bien visible */}
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px 0', lineHeight: '1.6', paddingBottom: '16px', borderBottom: '1px solid #e0e0e0' }}>
                  {selectedPost.offerSubDesc}
                </p>

                {/* Instructions - sympa et générique */}
                <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', fontSize: '13px', color: '#1a1a1a' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>🎁 Demande le code à ton commerçant</p>
                  <p style={{ margin: 0, color: '#666' }}>pour profiter de l'offre!</p>
                </div>

                {/* Code input - Pavé numérique */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '12px', fontWeight: '500' }}>Code 🔐</label>

                  {/* Affichage du code */}
                  <div style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '32px',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                    color: isCodeCorrect ? '#00aa00' : '#FF6B35',
                    border: '1px solid ' + (isCodeCorrect ? '#00aa00' : '#e0e0e0'),
                    borderRadius: '8px',
                    letterSpacing: '12px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    {codeInput.split('').map((digit, i) => (
                      <span key={i} style={{ display: 'inline-block', width: '30px' }}>
                        {digit ? '●' : '○'}
                      </span>
                    ))}
                  </div>

                  {/* Pavé numérique compact */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        onClick={() => codeInput.length < 4 && setCodeInput(codeInput + num)}
                        style={{
                          padding: '10px',
                          fontSize: '14px',
                          fontWeight: '600',
                          backgroundColor: '#f0f0f0',
                          color: '#1a1a1a',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          cursor: codeInput.length < 4 ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s',
                          opacity: codeInput.length < 4 ? 1 : 0.5
                        }}
                        onMouseEnter={(e) => codeInput.length < 4 && (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Row 0 + Effacer */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' }}>
                    <button
                      onClick={() => codeInput.length < 4 && setCodeInput(codeInput + '0')}
                      style={{
                        padding: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: '#f0f0f0',
                        color: '#1a1a1a',
                        border: '1px solid #e0e0e0',
                        borderRadius: '6px',
                        cursor: codeInput.length < 4 ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        opacity: codeInput.length < 4 ? 1 : 0.5,
                        gridColumn: '1 / 2'
                      }}
                      onMouseEnter={(e) => codeInput.length < 4 && (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                    >
                      0
                    </button>

                    <div></div>

                    <button
                      onClick={() => setCodeInput(codeInput.slice(0, -1))}
                      style={{
                        padding: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: '#FF6B35',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E55A28')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
                    >
                      ⌫
                    </button>
                  </div>

                  {/* Messages - seulement après 4 chiffres */}
                  {codeInput.length === 4 && !isCodeCorrect && (
                    <p style={{ fontSize: '12px', color: '#ff4444', margin: '8px 0 0 0', textAlign: 'center' }}>❌ Code incorrect</p>
                  )}
                  {isCodeCorrect && (
                    <p style={{ fontSize: '12px', color: '#00aa00', margin: '8px 0 0 0', textAlign: 'center' }}>✅ Code correct!</p>
                  )}
                </div>

                {/* Bouton Valider - grisé si code incorrect */}
                <button
                  onClick={completeOffer}
                  disabled={!isCodeCorrect}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: isCodeCorrect ? '#FF6B35' : '#e0e0e0',
                    color: isCodeCorrect ? 'white' : '#999',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isCodeCorrect ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {isCodeCorrect ? '✅ Valide ton offre (+25 pts)' : 'Valide ton offre'}
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>Établissement</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#FF6B35', margin: '0 0 16px 0' }}>{selectedPost.bar.name}</p>

                <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>Offre</p>
                <p style={{ fontSize: '13px', color: '#1a1a1a', margin: 0 }}>{selectedPost.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CELEBRATION ANIMATION - Confettis à la validation */}
      {showCelebration && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2000 }}>
          {/* Confettis - 30 pièces */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`confetti-${i}`}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                backgroundColor: ['#FF6B35', '#FFD700', '#00aa00', '#FF1493', '#00CED1'][i % 5],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}

          {/* Message de célébration */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FF6B35',
            color: 'white',
            padding: '24px 48px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            textAlign: 'center',
            zIndex: 2001,
            boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)',
            animation: 'fadeInScale 0.5s ease-out',
          }}>
            ✅ Tu as gagné 25 points!
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        <button onClick={() => setActiveTab('home')} style={{ flex: 1, padding: '16px', textAlign: 'center', color: activeTab === 'home' ? '#FF6B35' : '#999', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}>
          <span style={{ fontSize: '20px' }}>🏠</span>Accueil
        </button>
        <button onClick={() => setActiveTab('profile')} style={{ flex: 1, padding: '16px', textAlign: 'center', color: activeTab === 'profile' ? '#FF6B35' : '#999', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}>
          <span style={{ fontSize: '20px' }}>👤</span>Profil
        </button>
      </div>
    </div>
  )
}
