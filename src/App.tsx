import { useState, useRef, useEffect } from 'react'

const BARS = [
  {
    id: 1,
    name: 'La Dame Jeanne',
    type: 'Cave à bières',
    location: 'Mouvaux',
    rating: 4.8,
    distance: 0.5,
    emoji: '🍻',
    tags: ['Terrasse', 'Parking'],
    profilePhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_ladamejeanne_profil.jpg',
    postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_ladamejeanne_post.jpg',
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
    type: 'Bar traditionnel',
    location: 'Croix',
    rating: 4.5,
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
    type: 'Bar exotique',
    location: 'Roubaix',
    rating: 4.3,
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
    type: 'Cocktail bar',
    location: 'Lys-lez-Lannoy',
    rating: 4.9,
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
    type: 'Bar chic',
    location: 'Mouvaux',
    rating: 4.7,
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
    type: 'Brasserie',
    location: 'Croix',
    rating: 4.4,
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
    type: 'Café bar',
    location: 'Roubaix',
    rating: 4.2,
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
    type: 'Micro-brasserie',
    location: 'Mouvaux',
    rating: 4.6,
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
    type: 'Bistrot',
    location: 'Tourcoing',
    rating: 4.1,
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
  { id: 1, barId: 1, description: '2 menus adulte achetés = 1 menu enfant offert 🎁' },
  { id: 2, barId: 2, description: 'Happy hour 17h-19h: -30% sur les bières 🍻' },
  { id: 3, barId: 3, description: 'Terrasse disponible maintenant! ☀️' },
  { id: 4, barId: 4, description: 'Cocktails signature à 8€ tout le mois 🍹' },
  { id: 5, barId: 5, description: 'Apéritif dinatoire gratuit à partir de 20h ✨' },
  { id: 6, barId: 6, description: 'Bière artisanale à découvrir cette semaine 🏭' },
  { id: 7, barId: 7, description: 'Café gourmand à moitié prix jusqu\'à 17h ☕' },
  { id: 8, barId: 8, description: 'Nouvelle micro-brasserie à tester 🔥' },
  { id: 9, barId: 9, description: 'Réservations possibles pour 4+ personnes 📞' },
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
                  <div style={{ backgroundColor: '#FFD700', color: '#000', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)' }}>
                    <div>Offre spéciale</div>
                    <div style={{ fontSize: '10px', fontWeight: 'normal' }}>OUSSA</div>
                    <div style={{ fontSize: '10px', fontWeight: 'normal', marginTop: '2px' }}>2h restantes</div>
                  </div>
                </div>

                <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #333', backgroundColor: '#0d1117' }}>
                  {bar.tags.map((tag) => (
                    <div key={tag} style={{ backgroundColor: '#FF6B35', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                      {tag}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ backgroundColor: '#0066FF', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                      {bar.type}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>⭐ {bar.rating}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{formatTime()}</div>
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
              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>📍 Localisation</p>
              <p style={{ margin: '0 0 16px 0', color: '#e0e0e0' }}>{selectedBar.location}</p>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>📞 Téléphone</p>
              <p style={{ margin: '0 0 16px 0', color: '#e0e0e0' }}>{selectedBar.phone}</p>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>📧 Email</p>
              <p style={{ margin: '0 0 16px 0', color: '#e0e0e0' }}>{selectedBar.email}</p>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>🌐 Réseaux & Avis</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a href={selectedBar.website} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FF6B35', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>Site Web</a>
                <a href={selectedBar.instagram} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#E4405F', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>Instagram</a>
                <a href={selectedBar.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#4285F4', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>Maps</a>
                <a href={selectedBar.googleReviewsUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FBBC04', color: '#000', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>Avis</a>
              </div>
            </div>

            <button onClick={closeModal} style={{ width: '100%', padding: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Fermer</button>
          </div>
        </div>
      )}

      {selectedPost && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={closeModal}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '100%', border: '2px solid #FF6B35', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B35', margin: 0 }}>Détail du Post</h2>
              <button onClick={closeModal} style={{ backgroundColor: '#333', color: '#e0e0e0', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            {selectedPost.bar.postPhoto && (
              <div style={{ width: '100%', height: '300px', backgroundColor: '#2a2a2a', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={selectedPost.bar.postPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ backgroundColor: '#0d1117', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>📍 Établissement</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FF6B35', margin: '0 0 16px 0' }}>{selectedPost.bar.name}</p>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>🎯 Offre</p>
              <p style={{ fontSize: '16px', color: '#e0e0e0', margin: '0 0 16px 0', lineHeight: '1.6' }}>{selectedPost.description}</p>

              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>⭐ Note</p>
              <p style={{ fontSize: '16px', color: '#e0e0e0', margin: 0 }}>{selectedPost.bar.rating}/5</p>
            </div>

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
