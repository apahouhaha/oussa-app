import { useState } from 'react'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<'user' | 'bar'>('user')
  const [email, setEmail] = useState('test@example.com')

  const handleLogin = () => {
    if (!email) {
      alert('Remplis ton email!')
      return
    }
    setUser({ email, id: 'test-' + Date.now() })
  }

  const handleLogout = () => {
    setUser(null)
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0d1117',
      color: '#e0e0e0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    authContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    },
    authBox: {
      width: '100%',
      maxWidth: '400px',
      padding: '48px 24px',
      textAlign: 'center' as const,
    },
    logo: {
      fontSize: '48px',
      marginBottom: '24px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#FF6B35',
      marginBottom: '32px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      marginBottom: '16px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      color: '#e0e0e0',
      fontSize: '14px',
      boxSizing: 'border-box' as const,
    },
    button: {
      width: '100%',
      padding: '12px',
      marginBottom: '12px',
      backgroundColor: '#FF6B35',
      color: 'white',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    header: {
      background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
      color: 'white',
      padding: '24px',
      textAlign: 'center' as const,
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    headerSubtitle: {
      fontSize: '14px',
      opacity: 0.9,
    },
    content: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '24px 16px',
      paddingBottom: '120px',
    },
    card: {
      backgroundColor: '#1a1a1a',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '24px',
      textAlign: 'center' as const,
    },
    profileAvatar: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    profileName: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    profileEmail: {
      fontSize: '12px',
      color: '#888',
      marginBottom: '16px',
    },
    profileType: {
      fontSize: '12px',
      color: '#FFD700',
      fontWeight: 'bold',
      marginBottom: '24px',
    },
    success: {
      backgroundColor: '#0d3d0d',
      border: '1px solid #0d7700',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#90EE90',
    },
    bottomNav: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#161b22',
      borderTop: '1px solid #333',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 100,
    },
    navItem: {
      flex: 1,
      padding: '16px 8px',
      textAlign: 'center' as const,
      color: '#888',
      cursor: 'pointer',
      fontSize: '12px',
    },
    navIcon: {
      fontSize: '24px',
      marginBottom: '4px',
    },
  }

  if (!user) {
    return (
      <div style={{ ...styles.container, ...styles.authContainer }}>
        <div style={styles.authBox}>
          <div style={styles.logo}>🍻</div>
          <h1 style={styles.title}>OUSSA</h1>
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          
          <input
            type="password"
            placeholder="Mot de passe"
            defaultValue="test"
            style={styles.input}
          />

          <button
            onClick={() => {
              setUserType('user')
              handleLogin()
            }}
            style={styles.button}
          >
            👤 Utilisateur
          </button>

          <button
            onClick={() => {
              setUserType('bar')
              handleLogin()
            }}
            style={styles.button}
          >
            🏪 Commerçant
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>OUSSA</div>
        <div style={styles.headerSubtitle}>Buvez, mangez, festoyez!</div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.profileAvatar}>👤</div>
          <p style={styles.profileName}>{email.split('@')[0]}</p>
          <p style={styles.profileEmail}>{email}</p>
          <p style={styles.profileType}>
            Mode: {userType === 'user' ? 'Utilisateur' : 'Commerçant'}
          </p>
          <button
            onClick={handleLogout}
            style={styles.button}
          >
            ← Se déconnecter
          </button>
        </div>

        <div style={styles.success}>
          ✅ <strong>V1.1 OK! App fonctionne!</strong><br/>
          Prochaine: Ajouter posts et filtres
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={styles.bottomNav}>
        <div style={{...styles.navItem, color: '#FF6B35'}}>
          <div style={styles.navIcon}>🏠</div>
          <div>Accueil</div>
        </div>
        <div style={styles.navItem}>
          <div style={styles.navIcon}>⭐</div>
          <div>À la une</div>
        </div>
        <div style={styles.navItem}>
          <div style={styles.navIcon}>💖</div>
          <div>Coups</div>
        </div>
        <div style={styles.navItem}>
          <div style={styles.navIcon}>👤</div>
          <div>Profil</div>
        </div>
        {userType === 'bar' && (
          <div style={styles.navItem}>
            <div style={styles.navIcon}>🏢</div>
            <div>Espace</div>
          </div>
        )}
      </div>
    </div>
  )
}
