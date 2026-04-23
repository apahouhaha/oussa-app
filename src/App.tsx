import { useState, useRef, useEffect } from 'react'

const BARS = [
  { id: 1, name: 'La Dame Jeanne', type: 'Cave à bières', location: 'Mouvaux', rating: 4.8, distance: 0.5 },
  { id: 2, name: 'Le Rallye', type: 'Bar traditionnel', location: 'Croix', rating: 4.5, distance: 1.2 },
  { id: 3, name: 'Thida Angkor Bar', type: 'Bar exotique', location: 'Roubaix', rating: 4.3, distance: 2.1 },
  { id: 4, name: 'Drops', type: 'Cocktail bar', location: 'Lys-lez-Lannoy', rating: 4.9, distance: 1.8 },
  { id: 5, name: 'Le Comptoir', type: 'Bar chic', location: 'Mouvaux', rating: 4.7, distance: 0.8 },
  { id: 6, name: 'La Brasserie', type: 'Brasserie', location: 'Croix', rating: 4.4, distance: 1.5 },
  { id: 7, name: 'Café Moderne', type: 'Café bar', location: 'Roubaix', rating: 4.2, distance: 2.3 },
  { id: 8, name: 'Le Brassin', type: 'Micro-brasserie', location: 'Mouvaux', rating: 4.6, distance: 0.3 },
  { id: 9, name: 'Bistro du Coin', type: 'Bistrot', location: 'Lys-lez-Lannoy', rating: 4.1, distance: 1.9 },
]

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('test@example.com')
  const [activeTab, setActiveTab] = useState('home')
  const [barPhotos, setBarPhotos] = useState<{ [key: number]: { profile?: string; post?: string } }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingBarId, setUploadingBarId] = useState<number | null>(null)
  const [uploadingType, setUploadingType] = useState<'profile' | 'post' | null>(null)

  useEffect(() => {
    const photos: { [key: number]: { profile?: string; post?: string } } = {}
    BARS.forEach((bar) => {
      const stored = localStorage.getItem(`bar_photos_${bar.id}`)
      if (stored) {
        try {
          photos[bar.id] = JSON.parse(stored)
        } catch (e) {
          console.error('Parse error:', e)
        }
      }
    })
    setBarPhotos(photos)
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
              <div key={bar.id} style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #333' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FF6B35', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', cursor: 'pointer', flexShrink: 0 }} onClick={() => handlePhotoUpload(bar.id, 'profile')}>
                    {barPhotos[bar.id]?.profile ? <img src={barPhotos[bar.id].profile} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '📍'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{bar.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{bar.type} • {bar.distance}km</div>
                  </div>
                </div>

                <div style={{ width: '100%', height: '200px', backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '16px', textAlign: 'center', fontSize: '12px', color: '#666' }} onClick={() => handlePhotoUpload(bar.id, 'post')}>
                  {barPhotos[bar.id]?.post ? <img src={barPhotos[bar.id].post} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📸 Clic pour ajouter'}
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>⭐ {bar.rating}</div>
                  <button style={{ padding: '8px 12px', backgroundColor: '#FF6B35', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '8px' }} onClick={() => handlePhotoUpload(bar.id, 'profile')}>📷 Photo</button>
                  <button style={{ padding: '8px 12px', backgroundColor: '#FF6B35', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }} onClick={() => handlePhotoUpload(bar.id, 'post')}>📸 Post</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{email.split('@')[0]}</p>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '24px' }}>{email}</p>
            <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: '#FF6B35', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Se déconnecter</button>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={processPhotoUpload} style={{ display: 'none' }} />

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#161b22', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
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
