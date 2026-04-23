import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<'user' | 'bar'>('user')
  const [screen, setScreen] = useState<'auth' | 'home'>('auth')
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('test')

  useEffect(() => {
    // Vérifier si user est déjà connecté
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setScreen('home')
      }
    }
    checkUser()
  }, [])

  const handleLogin = async () => {
    if (!email) {
      alert('Remplis ton email!')
      return
    }

    try {
      // Pour MVP: simple mock login (pas de vrai auth)
      setUser({ email, id: 'test-' + Date.now() })
      setScreen('home')
    } catch (error) {
      alert('Erreur login: ' + error)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setScreen('auth')
  }

  return (
    <div className="min-h-screen bg-oussa-dark">
      {screen === 'auth' ? (
        // AUTH SCREEN
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md px-6 py-12 text-center">
            <div className="text-6xl mb-6">🍻</div>
            <h1 className="text-4xl font-bold text-oussa-primary mb-8">OUSSA</h1>
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-6 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />

            <button
              onClick={() => {
                setUserType('user')
                handleLogin()
              }}
              className="w-full py-3 mb-3 bg-oussa-primary text-white font-bold rounded-lg hover:opacity-90"
            >
              👤 Utilisateur
            </button>

            <button
              onClick={() => {
                setUserType('bar')
                handleLogin()
              }}
              className="w-full py-3 bg-oussa-primary text-white font-bold rounded-lg hover:opacity-90"
            >
              🏪 Commerçant
            </button>
          </div>
        </div>
      ) : (
        // HOME SCREEN
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
          <div className="bg-gradient-to-r from-oussa-primary to-orange-500 text-white p-6 rounded-lg mb-6 text-center">
            <h1 className="text-2xl font-bold">OUSSA</h1>
            <p className="text-sm opacity-90">Buvez, mangez, festoyez!</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg mb-6 text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="text-lg font-bold mb-2">{email.split('@')[0]}</p>
            <p className="text-sm text-gray-400 mb-4">{email}</p>
            <p className="text-sm text-oussa-gold font-bold mb-6">
              Mode: {userType === 'user' ? 'Utilisateur' : 'Commerçant'}
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-oussa-primary text-white font-bold rounded-lg hover:opacity-90"
            >
              ← Se déconnecter
            </button>
          </div>

          <div className="bg-blue-900/20 border border-blue-500 p-4 rounded-lg">
            <p className="text-sm text-gray-300">
              ✅ <strong>V1-BASE connexion OK!</strong><br/>
              Prochaine étape: Ajouter les écrans d'accueil et fonctionnalités
            </p>
          </div>
        </div>
      )}

      {/* BOTTOM NAV - Visible si connecté */}
      {screen === 'home' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 flex justify-around">
          <button className="flex-1 py-4 text-center text-oussa-primary">
            <div className="text-2xl">🏠</div>
            <div className="text-xs font-bold">Accueil</div>
          </button>
          <button className="flex-1 py-4 text-center text-gray-400 hover:text-oussa-primary">
            <div className="text-2xl">⭐</div>
            <div className="text-xs font-bold">À la une</div>
          </button>
          <button className="flex-1 py-4 text-center text-gray-400 hover:text-oussa-primary">
            <div className="text-2xl">💖</div>
            <div className="text-xs font-bold">Coups</div>
          </button>
          <button className="flex-1 py-4 text-center text-gray-400 hover:text-oussa-primary">
            <div className="text-2xl">👤</div>
            <div className="text-xs font-bold">Profil</div>
          </button>
          {userType === 'bar' && (
            <button className="flex-1 py-4 text-center text-gray-400 hover:text-oussa-primary">
              <div className="text-2xl">🏢</div>
              <div className="text-xs font-bold">Espace</div>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
