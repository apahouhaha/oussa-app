export type Filter = {
  id: string
  emoji: string
  label: string
}

export const FILTERS: Filter[] = [
  { id: 'open', emoji: '⏰', label: 'Ouvert' },
  { id: 'nearby', emoji: '📍', label: '< 500m' },
  { id: 'terrasse', emoji: '☀️', label: 'Terrasse' },
  { id: 'wifi', emoji: '📶', label: 'WiFi' },
  { id: 'parking', emoji: '🅿️', label: 'Parking' },
  { id: 'metro', emoji: '🚇', label: 'Métro-Tram' },
  { id: 'takeaway', emoji: '🚚', label: 'À emporter' },
  { id: 'offers', emoji: '🎁', label: 'Offres' },
  { id: 'happyhour', emoji: '🍹', label: 'Happy Hour' },
  { id: 'pets', emoji: '🐕', label: 'Pet friendly' },
  { id: 'games', emoji: '🎲', label: 'Jeux' },
  { id: 'concerts', emoji: '🎵', label: 'Concerts' },
]

// IMPORTANT: Filter "Offres" cherche dans POSTS.isSpecialOffer, pas dans bar.filters!
