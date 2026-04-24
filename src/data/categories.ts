export type Category = {
  id: string
  emoji: string
  label: string
}

export const CATEGORIES: Category[] = [
  { id: 'bars', emoji: '🍻', label: 'Bars' },
  { id: 'restos', emoji: '🍽️', label: 'Restos' },
  { id: 'clubs', emoji: '🎵', label: 'Clubs' },
  { id: 'events', emoji: '🎪', label: 'Événementiel' },
  { id: 'other', emoji: '🌍', label: 'Autres' },
]
