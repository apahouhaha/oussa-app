import { useState, useRef, useEffect } from 'react'

const BARS = [
  {
    id: 1,
    name: 'La Dame Jeanne',
    type: ['Cave à bières', 'Bar'],
    location: 'Mouvaux',
    rating: null,
    distance: 0.5,
    emoji: '🍻',
    tags: ['Terrasse', 'Parking'],
    profilePhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_ladamejeanne_profil.jpg',
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_ladamejeanne_post.jpg',
    title: 'Ta bière 33cl au prix de la 25cl!',
    description: 'Valable sur nos becs 1 à 5, sur présentation de l\'appli',
    phone: '+33 3 20 55 XX XX',
    email: 'contact@ladamejeanne.fr',
    googleMapsUrl: 'https://maps.google.com/?q=La+Dame+Jeanne+Mouvaux',
    googleReviewsUrl: 'https://g.page/ladamejeanne',
    instagram: 'https://instagram.com/ladamejeanne',
    website: 'https://ladamejeanne.fr',
  },
  {
    id: 2,
    name: 'Le Rallye',
    type: ['Bar traditionnel'],
    location: 'Croix',
    rating: null,
    distance: 1.2,
    emoji: '🎲',
    tags: ['Métro', 'Happy Hour'],
    profilePhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_lerallye_profil.jpg',
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_lerallye_post.jpg',
    phone: '+33 3 XX XX XX XX',
    email: 'contact@lerallye.fr',
    googleMapsUrl: 'https://maps.google.com/?q=Le+Rallye+Croix',
    googleReviewsUrl: 'https://g.page/lerallye',
    instagram: 'https://instagram.com/lerallye',
    website: 'https://lerallye.fr',
  },
  {
    id: 3,
    name: 'Thida Angkor Bar',
    type: ['Bar exotique'],
    location: 'Roubaix',
    rating: null,
    distance: 2.1,
    emoji: '🌏',
    tags: ['Terrasse', 'Métro'],
    profilePhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_thida_profil.jpg',
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_thida_post.jpg',
    phone: '+33 3 XX XX XX XX',
    email: 'contact@thida.fr',
    googleMapsUrl: 'https://maps.google.com/?q=Thida+Angkor+Bar+Roubaix',
    googleReviewsUrl: 'https://g.page/thida',
    instagram: 'https://instagram.com/thida',
    website: 'https://thida.fr',
  },
  {
    id: 4,
    name: 'Drops',
    type: ['Cocktail bar'],
    location: 'Lys-lez-Lannoy',
    rating: null,
    distance: 1.8,
    emoji: '💧',
    tags: ['Happy Hour', 'Parking'],
    profilePhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_drops_profil.jpg',
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_drops_post.jpg',
    phone: '+33 3 XX XX XX XX',
    email: 'contact@drops.fr',
    googleMapsUrl: 'https://maps.google.com/?q=Drops+Lys-lez-Lannoy',
    googleReviewsUrl: 'https://g.page/drops',
    instagram: 'https://instagram.com/drops',
    website: 'https://drops.fr',
  },
  {
    id: 5,
    name: 'Le Comptoir',
    type: ['Bar chic'],
    location: 'Mouvaux',
    rating: null,
    distance: 0.8,
    emoji: '🍷',
    tags: ['Terrasse'],
    profilePhoto: null,
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_lecomptoir_post.jpg',
    phone: '+33 3 XX XX XX XX',
    email: 'contact@comptoir.fr',
    googleMapsUrl: 'https://maps.google.com/?q=Le+Comptoir+Mouvaux',
    googleReviewsUrl: 'https://g.page/comptoir',
    instagram: 'https://instagram.com/comptoir',
    website: 'https://comptoir.fr',
  },
  {
    id: 6,
    name: 'La Brasserie',
    type: ['Brasserie'],
    location: 'Croix',
    rating: null,
    distance: 1.5,
    emoji: '🍺',
    tags: ['Terrasse', 'Happy Hour'],
    profilePhoto: null,
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_labrasserie_post.jpg',
    phone: '+33 3 XX XX XX XX',
    email: 'contact@brasserie.fr',
    googleMapsUrl: 'https://maps.google.com/?q=La+Brasserie+Croix',
    googleReviewsUrl: 'https://g.page/brasserie',
    instagram: 'https://instagram.com/brasserie',
    website: 'https://brasserie.fr',
  },
  {
    id: 7,
    name: 'Café Moderne',
    type: ['Café bar'],
    location: 'Roubaix',
    rating: null,
    distance: 2.3,
    emoji: '☕',
    tags: ['Métro', 'Parking'],
    profilePhoto: null,
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_cafemoderne_post.jpg',
    phone: '+33 3 XX XX XX XX',
    email: 'contact@cafemodern.fr',
    googleMapsUrl: 'https://maps.google.com/?q=Cafe+Moderne+Roubaix',
    googleReviewsUrl: 'https://g.page/cafemodern',
    instagram: 'https://instagram.com/cafemodern',
    website: 'https://cafemodern.fr',
  },
  {
    id: 8,
    name: 'Le Brassin',
    type: ['Micro-brasserie'],
    location: 'Mouvaux',
    rating: null,
    distance: 0.3,
    emoji: '🏭',
    tags: ['Terrasse'],
    profilePhoto: null,
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_lebrassin_post.jpg',
    phone: '+33 3 XX XX XX XX',
    email: 'contact@brassin.fr',
    googleMapsUrl: 'https://maps.google.com/?q=Le+Brassin+Mouvaux',
    googleReviewsUrl: 'https://g.page/brassin',
    instagram: 'https://instagram.com/brassin',
    website: 'https://brassin.fr',
  },
  {
    id: 9,
    name: 'Bistro du Coin',
    type: ['Bistrot'],
    location: 'Tourcoing',
    rating: null,
    distance: 1.9,
    emoji: '🍽️',
    tags: ['Happy Hour', 'Métro'],
    profilePhoto: null,
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_bistrotducoin_post.jpg',
    phone: '+33 3 XX XX XX XX',
    email: 'contact@bistro.fr',
    googleMapsUrl: 'https://maps.google.com/?q=Bistro+du+Coin+Tourcoing',
    googleReviewsUrl: 'https://g.page/bistro',
    instagram: 'https://instagram.com/bistro',
    website: 'https://bistro.fr',
  },
]

const POSTS = [
  { id: 1, barId: 1, description: 'Ta bière 33cl au prix de la 25cl!', isSpecialOffer: true, specialOfferCode: '1234' },
  { id: 2, barId: 2, description: 'Happy hour 17h-19h: -30% sur les bières 🍻', isSpecialOffer: false },
  { id: 3, barId: 3, description: 'Terrasse disponible maintenant! ☀️', isSpecialOffer: true, specialOfferCode: '1234' },
  { id: 4, barId: 4, description: 'Cocktails signature à 8€ tout le mois 🍹', isSpecialOffer: false },
  { id: 5, barId: 5, description: 'Apéritif dinatoire gratuit à partir de 20h ✨', isSpecialOffer: true, specialOfferCode: '1234' },
  { id: 6, barId: 6, description: 'Bière artisanale à découvrir cette semaine 🏭', isSpecialOffer: false },
  { id: 7, barId: 7, description: 'Café gourmand à moitié prix jusqu\'à 17h ☕', isSpecialOffer: false },
  { id: 8, barId: 8, description: 'Nouvelle micro-brasserie à tester 🔥', isSpecialOffer: true, specialOfferCode: '1234' },
  { id: 9, barId: 9, description: 'Réservations possibles pour 4+ personnes 📞', isSpecialOffer: false },
]

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('test@example.com')
  const [activeTab, setActiveTab] = useState('home')
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({})
  const [likeCount, setLikeCount] = useState<{ [key: number]: number }>({})
  const [selectedBar, setSelectedBar] = useState<any>(null)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({})
  const [codeInput, setCodeInput] = useState('')
  const [codeVerified, setCodeVerified] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [barLikes, setBarLikes] = useState<{ [key: number]: boolean }>({})
  const [barLikeCount, setBarLikeCount] = useState<{ [key: number]: number }>({})

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

  const formatTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
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
      setCodeError(false)
      setSliderValue(0)
    }
  }

  const verifyCode = () => {
    if (!selectedPost) return
    if (codeInput === selectedPost.specialOfferCode) {
      setCodeVerified(true)
      setCodeError(false)
    } else {
      setCodeError(true)
      setCodeInput('')
    }
  }

  const completeOffer = () => {
    if (codeVerified && sliderValue === 100) {
      alert('✅ Offre validée! Vous avez gagné 25 points!')
      closeModal()
    }
  }

  const closeModal = () => {
    setSelectedBar(null)
    setSelectedPost(null)
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🍻</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF6B35', marginBottom: '32px' }}>OUSSA</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', marginBottom: '16px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', fontSize: '14px', boxSizing: 'border-box' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>👤 Utilisateur</button>
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>🏪 Commerçant</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#e0e0e0' }}>
      <div style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)', color: 'white', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>OUSSA</div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>Buvez, mangez, festoyez!</div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px', paddingBottom: '120px' }}>
        {activeTab === 'home' && (
          <div>
            {BARS.map((bar) => (
              <div key={bar.id} style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', border: '2px solid #FF6B35', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px', borderBottom: '1px solid #333', backgroundColor: '#0d1117' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, cursor: 'pointer' }} onClick={() => openBarProfile(bar)}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                      {bar.profilePhoto ? (
                        <>
                          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#2a2a2a', display: imageLoading[`profile_${bar.id}`] ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>⏳</div>
                          <img src={bar.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: imageLoading[`profile_${bar.id}`] ? 'none' : 'block' }} onLoad={() => setImageLoading((prev) => ({ ...prev, [`profile_${bar.id}`]: false }))} onError={() => setImageLoading((prev) => ({ ...prev, [`profile_${bar.id}`]: false }))} />
                        </>
                      ) : (
                        bar.emoji
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{bar.name}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>à {bar.distance}km</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>📍 {bar.location}</div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#1a1a1a', color: '#FFD700', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '12px', textAlign: 'center', boxShadow: '0 4px 16px rgba(255, 215, 0, 0.6)', border: '2px solid #FFD700' }}>
                    <div style={{ fontSize: '12px', marginBottom: '6px' }}>✨ OFFRE SPÉCIALE ✨</div>
                    <div style={{ fontSize: '11px', fontWeight: 'normal' }}>2h restantes</div>
                  </div>
                </div>

                <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #333', backgroundColor: '#0d1117' }}>
                  {bar.tags.map((tag) => (
                    <div key={tag} style={{ backgroundColor: '#FF6B35', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                      {tag}
                    </div>
                  ))}
                </div>

                <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #333', backgroundColor: '#0d1117' }}>
                  <div style={{ fontSize: '11px', color: '#888', marginRight: '8px', display: 'flex', alignItems: 'center' }}>📍 Type:</div>
                  {(typeof bar.type === 'string' ? [bar.type] : bar.type).map((t) => (
                    <div key={t} style={{ backgroundColor: '#0066FF', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                      {t}
                    </div>
                  ))}
                </div>

                <div style={{ width: '100%', height: '280px', backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center', fontSize: '12px', color: '#666', overflow: 'hidden', borderTop: '3px solid #FF6B35', position: 'relative' }} onClick={() => openPostDetail(bar.id)}>
                  {bar.postPhoto ? (
                    <>
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#2a2a2a', display: imageLoading[`post_${bar.id}`] ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⏳</div>
                      <img src={bar.postPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: imageLoading[`post_${bar.id}`] ? 'none' : 'block' }} onLoad={() => setImageLoading((prev) => ({ ...prev, [`post_${bar.id}`]: false }))} onError={() => setImageLoading((prev) => ({ ...prev, [`post_${bar.id}`]: false }))} />
                    </>
                  ) : (
                    '📸 Clic pour voir'
                  )}
                </div>

                <div style={{ padding: '16px', borderBottom: '1px solid #333', backgroundColor: '#0d1117' }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#e0e0e0' }}>
                    {POSTS.find((p) => p.barId === bar.id)?.description}
                  </div>
                </div>

                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0d1117', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '11px', color: '#666' }}>📍 Posté à l'instant</div>
                  <button onClick={() => toggleLike(bar.id)} style={{ padding: '8px 14px', backgroundColor: likes[bar.id] ? '#FF6B35' : '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                    {likes[bar.id] ? '❤️' : '🤍'} {likeCount[bar.id] || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '2px solid #FF6B35', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{email.split('@')[0]}</p>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '24px' }}>{email}</p>
            <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Se déconnecter</button>
          </div>
        )}
      </div>

      {selectedBar && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={closeModal}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '100%', border: '2px solid #FF6B35', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B35', margin: 0 }}>{selectedBar.name}</h2>
              <button onClick={closeModal} style={{ backgroundColor: '#333', color: '#e0e0e0', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            {selectedBar.profilePhoto && (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#2a2a2a', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={selectedBar.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ backgroundColor: '#0d1117', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              {selectedBar.title && (
                <>
                  <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>🎯 Offre Spéciale</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFD700', margin: '0 0 8px 0' }}>{selectedBar.title}</p>
                  {selectedBar.description && (
                    <p style={{ fontSize: '12px', color: '#ccc', margin: '0 0 16px 0', fontStyle: 'italic' }}>📍 {selectedBar.description}</p>
                  )}
                </>
              )}

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>🏷️ Type d'établissement</p>
              <p style={{ margin: '0 0 16px 0', color: '#e0e0e0' }}>
                {typeof selectedBar.type === 'string' ? selectedBar.type : selectedBar.type.join(' / ')}
              </p>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>📍 Localisation</p>
              <p style={{ margin: '0 0 16px 0', color: '#e0e0e0' }}>{selectedBar.location}</p>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>📞 Téléphone</p>
              <p style={{ margin: '0 0 16px 0', color: '#e0e0e0' }}>{selectedBar.phone}</p>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>📧 Email</p>
              <p style={{ margin: '0 0 16px 0', color: '#e0e0e0' }}>{selectedBar.email}</p>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>🌐 Réseaux & Avis</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <a href={selectedBar.website} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FF6B35', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>Site Web</a>
                <a href={selectedBar.instagram} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#E4405F', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>Instagram</a>
                <a href={selectedBar.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#4285F4', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>Maps</a>
                <a href={selectedBar.googleReviewsUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FBBC04', color: '#000', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>Avis</a>
              </div>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>❤️ Vous aimez cet établissement?</p>
              <button 
                onClick={() => toggleBarLike(selectedBar.id)} 
                style={{ width: '100%', padding: '12px', backgroundColor: barLikes[selectedBar.id] ? '#FF6B35' : '#333', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s', marginBottom: '16px' }}
              >
                {barLikes[selectedBar.id] ? '❤️ J\'aime (' + (barLikeCount[selectedBar.id] || 0) + ')' : '🤍 J\'aime (' + (barLikeCount[selectedBar.id] || 0) + ')'}
              </button>
            </div>

            <button onClick={closeModal} style={{ width: '100%', padding: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Fermer</button>
          </div>
        </div>
      )}

      {selectedPost && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={closeModal}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '100%', border: '2px solid #FF6B35', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF6B35', margin: 0 }}>
                {selectedPost.isSpecialOffer ? '✨ OFFRE SPÉCIALE' : 'Détail du Post'}
              </h2>
              <button onClick={closeModal} style={{ backgroundColor: '#333', color: '#e0e0e0', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            {selectedPost.isSpecialOffer ? (
              <div style={{ backgroundColor: '#0d1117', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#FFD700', color: '#000', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', lineHeight: '1.5' }}>
                  🎁 {selectedPost.description}
                </div>

                {selectedPost.bar.description && (
                  <p style={{ fontSize: '12px', color: '#ccc', margin: '0 0 16px 0', fontStyle: 'italic', padding: '12px', backgroundColor: '#1a1a1a', borderRadius: '6px', borderLeft: '3px solid #FFD700' }}>
                    📍 {selectedPost.bar.description}
                  </p>
                )}

                <div style={{ backgroundColor: '#FF6B35', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontSize: '13px', lineHeight: '1.6' }}>
                  <p style={{ margin: '0 0 8px 0' }}>⚠️ Offre réservée</p>
                  <p style={{ margin: 0 }}>Limitée à <strong>UNE SEULE UTILISATION</strong> par personne</p>
                </div>

                <p style={{ fontSize: '14px', color: '#e0e0e0', marginBottom: '16px', textAlign: 'center', lineHeight: '1.6' }}>
                  <strong>🎯 Rendez-vous au comptoir</strong> de <strong>{selectedPost.bar.name}</strong> et demandez au commerçant le code secret à 4 chiffres.
                </p>

                <div style={{ backgroundColor: '#FF6B35', color: 'white', padding: '16px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', margin: '0 0 12px 0' }}>🔐 Entrez le code fourni par le commerçant:</p>
                  <input
                    type="text"
                    placeholder="• • • •"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.slice(0, 4))}
                    maxLength={4}
                    style={{ width: '100%', padding: '12px', fontSize: '18px', textAlign: 'center', backgroundColor: '#fff', color: '#FF6B35', border: codeError ? '2px solid #ff4444' : 'none', borderRadius: '6px', marginBottom: '12px', letterSpacing: '8px', fontWeight: 'bold' }}
                  />
                  {codeError && <p style={{ color: '#ff4444', fontSize: '12px', margin: '0 0 8px 0' }}>❌ Code incorrect</p>}
                  <button
                    onClick={verifyCode}
                    disabled={codeInput.length < 4 || codeVerified}
                    style={{ width: '100%', padding: '10px', backgroundColor: codeVerified ? '#00aa00' : '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: codeVerified ? 'default' : 'pointer', fontSize: '12px', fontWeight: 'bold', opacity: codeInput.length < 4 || codeVerified ? 0.6 : 1 }}
                  >
                    {codeVerified ? '✅ Code vérifié!' : 'Vérifier le code'}
                  </button>
                </div>

                {codeVerified && (
                  <div style={{ backgroundColor: '#0d1117', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>🎯 Glissez jusqu'au bout pour valider:</p>
                    <div style={{ marginBottom: '12px' }}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(parseInt(e.target.value))}
                        style={{ width: '100%', height: '48px', cursor: 'pointer', backgroundColor: '#333', borderRadius: '6px' }}
                      />
                    </div>
                    <p style={{ fontSize: '12px', color: '#FF6B35', textAlign: 'center', fontWeight: 'bold', margin: 0 }}>{sliderValue}%</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ backgroundColor: '#0d1117', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>📍 Établissement</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FF6B35', margin: '0 0 16px 0' }}>{selectedPost.bar.name}</p>

                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>🎯 Offre</p>
                <p style={{ fontSize: '16px', color: '#e0e0e0', margin: '0', lineHeight: '1.6' }}>{selectedPost.description}</p>
              </div>
            )}

            {codeVerified && sliderValue === 100 && (
              <button onClick={completeOffer} style={{ width: '100%', padding: '12px', backgroundColor: '#00aa00', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginBottom: '12px' }}>✅ Valider l'offre (+25 points)</button>
            )}

            <button onClick={closeModal} style={{ width: '100%', padding: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Fermer</button>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#161b22', borderTop: '2px solid #FF6B35', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        <div style={{ flex: 1, padding: '16px 8px', textAlign: 'center', color: activeTab === 'home' ? '#FF6B35' : '#888', cursor: 'pointer', fontSize: '12px' }} onClick={() => setActiveTab('home')}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏠</div><div>Accueil</div>
        </div>
        <div style={{ flex: 1, padding: '16px 8px', textAlign: 'center', color: '#888', cursor: 'not-allowed', fontSize: '12px', opacity: 0.5 }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>⭐</div><div>À la une</div>
        </div>
        <div style={{ flex: 1, padding: '16px 8px', textAlign: 'center', color: '#888', cursor: 'not-allowed', fontSize: '12px', opacity: 0.5 }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>💖</div><div>Coups</div>
        </div>
        <div style={{ flex: 1, padding: '16px 8px', textAlign: 'center', color: activeTab === 'profile' ? '#FF6B35' : '#888', cursor: 'pointer', fontSize: '12px' }} onClick={() => setActiveTab('profile')}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>👤</div><div>Profil</div>
        </div>
      </div>
    </div>
  )
}
