import { useState, useRef, useEffect } from 'react'

const BARS = [
  { id: 1, name: 'La Dame Jeanne', type: 'Cave à bières', location: 'Mouvaux', rating: 4.8, distance: 0.5, emoji: '🍻', tags: ['Terrasse', 'Parking'] },
  { id: 2, name: 'Le Rallye', type: 'Bar traditionnel', location: 'Croix', rating: 4.5, distance: 1.2, emoji: '🎲', tags: ['Métro', 'Happy Hour'] },
  { id: 3, name: 'Thida Angkor Bar', type: 'Bar exotique', location: 'Roubaix', rating: 4.3, distance: 2.1, emoji: '🌏', tags: ['Terrasse', 'Métro'] },
  { id: 4, name: 'Drops', type: 'Cocktail bar', location: 'Lys-lez-Lannoy', rating: 4.9, distance: 1.8, emoji: '💧', tags: ['Happy Hour', 'Parking'] },
  { id: 5, name: 'Le Comptoir', type: 'Bar chic', location: 'Mouvaux', rating: 4.7, distance: 0.8, emoji: '🍷', tags: ['Terrasse'] },
  { id: 6, name: 'La Brasserie', type: 'Brasserie', location: 'Croix', rating: 4.4, distance: 1.5, emoji: '🍺', tags: ['Terrasse', 'Happy Hour'] },
  { id: 7, name: 'Café Moderne', type: 'Café bar', location: 'Roubaix', rating: 4.2, distance: 2.3, emoji: '☕', tags: ['Métro', 'Parking'] },
  { id: 8, name: 'Le Brassin', type: 'Micro-brasserie', location: 'Mouvaux', rating: 4.6, distance: 0.3, emoji: '🏭', tags: ['Terrasse'] },
  { id: 9, name: 'Bistro du Coin', type: 'Bistrot', location: 'Tourcoing', rating: 4.1, distance: 1.9, emoji: '🍽️', tags: ['Happy Hour', 'Métro'] },
]

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('test@example.com')
  const [activeTab, setActiveTab] = useState('home')
  const [barPhotos, setBarPhotos] = useState<{ [key: number]: { profile?: string; post?: string } }>({})
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({})
  const [likeCount, setLikeCount] = useState<{ [key: number]: number }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingBarId, setUploadingBarId] = useState<number | null>(null)
  const [uploadingType, setUploadingType] = useState<'profile' | 'post' | null>(null)

  useEffect(() => {
    const photos: { [key: number]: { profile?: string; post?: string } } = {}
    const likesCounts: { [key: number]: number } = {}
    BARS.forEach((bar) => {
      const stored = localStorage.getItem(`bar_photos_${bar.id}`)
      if (stored) {
        try {
          photos[bar.id] = JSON.parse(stored)
        } catch (e) {
          console.error('Parse error:', e)
        }
      }
      likesCounts[bar.id] = parseInt(localStorage.getItem(`bar_likes_${bar.id}`) || '0')
    })
    setBarPhotos(photos)
    setLikeCount(likesCounts)
  }, [])

  const handleLogin = () => {
    setUser({ email, id: 'test' })
  }

  const handleLogout = () => {
    setUser(null)
  }

  const handlePhotoUpload = (barId: number, type: 'profile' | 'post') => {
    setUploadingBarId(barId)
    setUploadingType(type)
    fileInputRef.current?.click()
  }

  const processPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || uploadingBarId === null || !uploadingType) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      const updated = { ...barPhotos[uploadingBarId], [uploadingType]: base64 }
      setBarPhotos((prev) => ({ ...prev, [uploadingBarId]: updated }))
      localStorage.setItem(`bar_photos_${uploadingBarId}`, JSON.stringify(updated))
      alert('Photo uploadée!')
    }
    reader.readAsDataURL(file)
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', cursor: 'pointer', flexShrink: 0, overflow: 'hidden' }} onClick={() => handlePhotoUpload(bar.id, 'profile')}>
                      {barPhotos[bar.id]?.profile ? <img src={barPhotos[bar.id].profile} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : bar.emoji}
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

                <div style={{ width: '100%', height: '280px', backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center', fontSize: '12px', color: '#666', overflow: 'hidden', borderTop: '3px solid #FF6B35' }} onClick={() => handlePhotoUpload(bar.id, 'post')}>
                  {barPhotos[bar.id]?.post ? <img src={barPhotos[bar.id].post} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📸 Clic pour ajouter'}
                </div>

                <div style={{ padding: '16px', borderBottom: '1px solid #333', backgroundColor: '#0d1117' }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#e0e0e0' }}>
                    {bar.id === 1 && '2 menus adulte achetés = 1 menu enfant offert 🎁'}
                    {bar.id === 2 && 'Happy hour 17h-19h: -30% sur les bières 🍻'}
                    {bar.id === 3 && 'Terrasse disponible maintenant! ☀️'}
                    {bar.id === 4 && 'Cocktails signature à 8€ tout le mois 🍹'}
                    {bar.id === 5 && 'Apéritif dinatoire gratuit à partir de 20h ✨'}
                    {bar.id === 6 && 'Bière artisanale à découvrir cette semaine 🏭'}
                    {bar.id === 7 && 'Café gourmand à moitié prix jusqu\'à 17h ☕'}
                    {bar.id === 8 && 'Nouvelle micro-brasserie à tester 🔥'}
                    {bar.id === 9 && 'Réservations possibles pour 4+ personnes 📞'}
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

      <input ref={fileInputRef} type="file" accept="image/*" onChange={processPhotoUpload} style={{ display: 'none' }} />

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
