export type Post = {
  id: number
  barId: number
  description: string
  isSpecialOffer: boolean
  specialOfferCode: string
  offerTitle?: string
  offerSubDesc?: string
}

export const POSTS: Post[] = [
  { id: 1, barId: 1, description: 'Ambiance chaleureuse ce soir! Venez nous rejoindre au comptoir 🍻', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Ta bière 33cl au prix de la 25cl!', offerSubDesc: 'Valable sur nos becs 1 à 5, sur présentation de l\'appli' },
  { id: 2, barId: 2, description: 'Tournoi de belotte ce weekend! Inscriptions ouvertes 🎲', isSpecialOffer: false, specialOfferCode: '' },
  { id: 3, barId: 3, description: 'Happy hour extended jusqu\'à 20h ce soir! 🌏', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: '-30% sur tous les cocktails', offerSubDesc: 'De 17h à 20h au bar Thida' },
  { id: 4, barId: 4, description: 'Live music session en direct! 🍺', isSpecialOffer: false, specialOfferCode: '' },
  { id: 5, barId: 5, description: 'Terrasse chauffée disponible! Venez au frais ⚓', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Apéro offert avec une consommation', offerSubDesc: 'Planche charcuterie + verre de vin offerts' },
  { id: 6, barId: 6, description: 'Cocktails maison frais du jour 🍸', isSpecialOffer: false, specialOfferCode: '' },
  { id: 7, barId: 7, description: 'Plus que 2 tables libres! Réservez maintenant ☕', isSpecialOffer: false, specialOfferCode: '' },
  { id: 8, barId: 8, description: 'Cabaret spectacle ce soir à 21h! 🎭', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Entrée gratuite pour 2 consommations', offerSubDesc: 'Valable pour le spectacle de 21h ce soir' },
  { id: 9, barId: 9, description: 'Tapas fraiches préparées à l\'instant 🍤', isSpecialOffer: false, specialOfferCode: '' },
  { id: 10, barId: 10, description: 'Bière artisanale locale en promotion 🍻', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'La pinte à 5€ au lieu de 7€', offerSubDesc: 'Bière de la brasserie locale en promotion spéciale' },
  { id: 11, barId: 11, description: 'Assiettes partagées et ambiance lounge ce soir 🍷', isSpecialOffer: false, specialOfferCode: '' },
  { id: 12, barId: 12, description: 'Service à table jusqu\'à minuit ce weekend 🍺', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Dessert offert avec menu complet', offerSubDesc: 'Menu 3 plats + dessert offert' },
  { id: 13, barId: 13, description: 'Cuisine raffinée au cœur de Lille 🥘', isSpecialOffer: false, specialOfferCode: '' },
  { id: 14, barId: 14, description: 'Pizzas cuites au feu de bois 🍕', isSpecialOffer: false, specialOfferCode: '' },
  { id: 15, barId: 15, description: 'Plateau sushi dégustation spécial 🍣', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: '20% sur les plateaux sushi', offerSubDesc: '20% de réduction sur tous les plateaux' },
  { id: 16, barId: 16, description: 'Burgers maison et frites croustillantes 🍔', isSpecialOffer: false, specialOfferCode: '' },
  { id: 17, barId: 17, description: 'Bistrot parisien authentique 🍴', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Verre de vin offert avec entrée', offerSubDesc: 'Sélection de vins de région offerte' },
  { id: 18, barId: 18, description: 'Cuisine thaï traditionnelle 🥢', isSpecialOffer: false, specialOfferCode: '' },
  { id: 19, barId: 19, description: 'Steaks premium et vins sélectionnés 🥩', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Steak frites + verre inclus', offerSubDesc: 'Menu enfant offert avec achat de 2 menus adulte' },
  { id: 20, barId: 20, description: 'Cuisine vegan innovante et savoureuse 🥗', isSpecialOffer: false, specialOfferCode: '' },
]
