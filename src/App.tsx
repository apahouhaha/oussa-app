import { useState, useRef, useEffect } from 'react'

// ===== IMPORTS DES FICHIERS MODULAIRES =====
import { FILTERS } from './data/filters'
import { CATEGORIES } from './data/categories'
import { BARS } from './data/bars'
import { POSTS } from './data/posts'
import { COLORS } from './constants/styles'

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
                                                                                                            color: #FF6B35;
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

const CATEGORIES = [
  { id: 'bars', emoji: '🍻', label: 'Bars' },
  { id: 'restos', emoji: '🍽️', label: 'Restos' },
  { id: 'clubs', emoji: '🎵', label: 'Clubs' },
  { id: 'events', emoji: '🎪', label: 'Événementiel' },
  { id: 'other', emoji: '🌍', label: 'Autres' },
]

const FILTER_OPTIONS = [
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

const BARS = [
  // BARS - 10 établissements
  { id: 1, name: 'La Dame Jeanne', category: 'bars', location: 'Mouvaux', distance: 0.5, emoji: '🍻', filters: ['terrasse', 'parking', 'offers', 'happyhour'], profilePhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_ladamejeanne_profil.jpg', postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_ladamejeanne_post.jpg', phone: '+33 3 20 55 01 01', email: 'contact@ladamejeanne.fr', googleMapsUrl: 'https://maps.google.com/?q=La+Dame+Jeanne+Mouvaux', googleReviewsUrl: 'https://g.page/ladamejeanne', instagram: 'https://instagram.com/ladamejeanne', website: 'https://ladamejeanne.fr' },
  { id: 2, name: 'Le Rallye', category: 'bars', location: 'Croix', distance: 1.2, emoji: '🎲', filters: ['metro', 'happyhour', 'games', 'wifi'], profilePhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_lerallye_profil.jpg', postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_lerallye_post.jpg', phone: '+33 3 20 55 02 02', email: 'contact@lerallye.fr', googleMapsUrl: 'https://maps.google.com/?q=Le+Rallye+Croix', googleReviewsUrl: 'https://g.page/lerallye', instagram: 'https://instagram.com/lerallye', website: 'https://lerallye.fr' },
  { id: 3, name: 'Thida Angkor Bar', category: 'bars', location: 'Roubaix', distance: 2.1, emoji: '🌏', filters: ['terrasse', 'metro', 'pets', 'offers'], profilePhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_thida_profil.jpg', postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_thida_post.jpg', phone: '+33 3 20 55 03 03', email: 'contact@thida.fr', googleMapsUrl: 'https://maps.google.com/?q=Thida+Bar', googleReviewsUrl: 'https://g.page/thida', instagram: 'https://instagram.com/thida', website: 'https://thida.fr' },
  { id: 4, name: 'The Irish Pub', category: 'bars', location: 'Mouvaux', distance: 0.8, emoji: '☘️', filters: ['terrasse', 'wifi', 'pets'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 04 04', email: 'contact@irishpub.fr', googleMapsUrl: 'https://maps.google.com/?q=Irish+Pub+Mouvaux', googleReviewsUrl: 'https://g.page/irishpub', instagram: 'https://instagram.com/irishpub', website: 'https://irishpub.fr' },
  { id: 5, name: 'Bar du Vieux Port', category: 'bars', location: 'Tourcoing', distance: 2.5, emoji: '⚓', filters: ['metro', 'parking', 'happyhour', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 05 05', email: 'contact@vieuxport.fr', googleMapsUrl: 'https://maps.google.com/?q=Bar+Vieux+Port', googleReviewsUrl: 'https://g.page/vieuxport', instagram: 'https://instagram.com/vieuxport', website: 'https://vieuxport.fr' },
  { id: 6, name: 'Cocktail Corner', category: 'bars', location: 'Croix', distance: 1.5, emoji: '🍸', filters: ['wifi', 'offers', 'parking'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 06 06', email: 'contact@cocktailcorner.fr', googleMapsUrl: 'https://maps.google.com/?q=Cocktail+Corner', googleReviewsUrl: 'https://g.page/cocktailcorner', instagram: 'https://instagram.com/cocktailcorner', website: 'https://cocktailcorner.fr' },
  { id: 7, name: 'Café du Coin', category: 'bars', location: 'Mouvaux', distance: 0.3, emoji: '☕', filters: ['terrasse', 'wifi', 'takeaway', 'pets'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 07 07', email: 'contact@cafducoin.fr', googleMapsUrl: 'https://maps.google.com/?q=Cafe+du+Coin', googleReviewsUrl: 'https://g.page/cafducoin', instagram: 'https://instagram.com/cafducoin', website: 'https://cafducoin.fr' },
  { id: 8, name: 'Le Cabaret', category: 'bars', location: 'Roubaix', distance: 2.3, emoji: '🎭', filters: ['concerts', 'parking', 'metro'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 08 08', email: 'contact@lecabaret.fr', googleMapsUrl: 'https://maps.google.com/?q=Le+Cabaret', googleReviewsUrl: 'https://g.page/lecabaret', instagram: 'https://instagram.com/lecabaret', website: 'https://lecabaret.fr' },
  { id: 9, name: 'Tapas Bar', category: 'bars', location: 'Croix', distance: 1.1, emoji: '🥘', filters: ['terrasse', 'happyhour', 'offers', 'wifi'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 09 09', email: 'contact@tapasbar.fr', googleMapsUrl: 'https://maps.google.com/?q=Tapas+Bar', googleReviewsUrl: 'https://g.page/tapasbar', instagram: 'https://instagram.com/tapasbar', website: 'https://tapasbar.fr' },
  { id: 10, name: 'Brasserie Moderne', category: 'bars', location: 'Mouvaux', distance: 1.0, emoji: '🍺', filters: ['terrasse', 'parking', 'pets', 'happyhour'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 10 10', email: 'contact@brasseriemoderne.fr', googleMapsUrl: 'https://maps.google.com/?q=Brasserie+Moderne', googleReviewsUrl: 'https://g.page/brasseriemoderne', instagram: 'https://instagram.com/brasseriemoderne', website: 'https://brasseriemoderne.fr' },

  // RESTOS - 10 établissements
  { id: 11, name: 'Le Comptoir', category: 'restos', location: 'Mouvaux', distance: 0.8, emoji: '🍷', filters: ['terrasse', 'wifi', 'takeaway', 'pets'], profilePhoto: null, postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_lecomptoir_post.jpg', phone: '+33 3 20 55 11 11', email: 'contact@comptoir.fr', googleMapsUrl: 'https://maps.google.com/?q=Le+Comptoir', googleReviewsUrl: 'https://g.page/comptoir', instagram: 'https://instagram.com/comptoir', website: 'https://comptoir.fr' },
  { id: 12, name: 'La Brasserie', category: 'restos', location: 'Croix', distance: 1.5, emoji: '🍺', filters: ['terrasse', 'happyhour', 'parking', 'offers'], profilePhoto: null, postPhoto: 'https://raw.githubusercontent.com/apahouhaha/oussa-app/main/photo_labrasserie_post.jpg', phone: '+33 3 20 55 12 12', email: 'contact@brasserie.fr', googleMapsUrl: 'https://maps.google.com/?q=La+Brasserie', googleReviewsUrl: 'https://g.page/brasserie', instagram: 'https://instagram.com/brasserie', website: 'https://brasserie.fr' },
  { id: 13, name: 'Le Gourmet', category: 'restos', location: 'Tourcoing', distance: 2.0, emoji: '🍽️', filters: ['wifi', 'parking', 'takeaway', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 13 13', email: 'contact@legourmet.fr', googleMapsUrl: 'https://maps.google.com/?q=Le+Gourmet', googleReviewsUrl: 'https://g.page/legourmet', instagram: 'https://instagram.com/legourmet', website: 'https://legourmet.fr' },
  { id: 14, name: 'Pizzeria Roma', category: 'restos', location: 'Mouvaux', distance: 1.2, emoji: '🍕', filters: ['takeaway', 'wifi', 'parking'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 14 14', email: 'contact@pizzeriaroma.fr', googleMapsUrl: 'https://maps.google.com/?q=Pizzeria+Roma', googleReviewsUrl: 'https://g.page/pizzeriaroma', instagram: 'https://instagram.com/pizzeriaroma', website: 'https://pizzeriaroma.fr' },
  { id: 15, name: 'Sushi Zen', category: 'restos', location: 'Croix', distance: 1.8, emoji: '🍣', filters: ['takeaway', 'wifi', 'offers', 'metro'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 15 15', email: 'contact@sushizen.fr', googleMapsUrl: 'https://maps.google.com/?q=Sushi+Zen', googleReviewsUrl: 'https://g.page/sushizen', instagram: 'https://instagram.com/sushizen', website: 'https://sushizen.fr' },
  { id: 16, name: 'Burger House', category: 'restos', location: 'Roubaix', distance: 2.2, emoji: '🍔', filters: ['takeaway', 'parking', 'happyhour'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 16 16', email: 'contact@burgerhouse.fr', googleMapsUrl: 'https://maps.google.com/?q=Burger+House', googleReviewsUrl: 'https://g.page/burgerhouse', instagram: 'https://instagram.com/burgerhouse', website: 'https://burgerhouse.fr' },
  { id: 17, name: 'Bistro Parisien', category: 'restos', location: 'Mouvaux', distance: 0.6, emoji: '🥖', filters: ['terrasse', 'wifi', 'parking', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 17 17', email: 'contact@bistroparisien.fr', googleMapsUrl: 'https://maps.google.com/?q=Bistro+Parisien', googleReviewsUrl: 'https://g.page/bistroparisien', instagram: 'https://instagram.com/bistroparisien', website: 'https://bistroparisien.fr' },
  { id: 18, name: 'Thai Palace', category: 'restos', location: 'Croix', distance: 1.4, emoji: '🍜', filters: ['takeaway', 'wifi', 'metro', 'pets'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 18 18', email: 'contact@thaipalace.fr', googleMapsUrl: 'https://maps.google.com/?q=Thai+Palace', googleReviewsUrl: 'https://g.page/thaipalace', instagram: 'https://instagram.com/thaipalace', website: 'https://thaipalace.fr' },
  { id: 19, name: 'Steakhouse Prime', category: 'restos', location: 'Tourcoing', distance: 2.4, emoji: '🥩', filters: ['parking', 'wifi', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 19 19', email: 'contact@steakhouseprime.fr', googleMapsUrl: 'https://maps.google.com/?q=Steakhouse+Prime', googleReviewsUrl: 'https://g.page/steakhouseprime', instagram: 'https://instagram.com/steakhouseprime', website: 'https://steakhouseprime.fr' },
  { id: 20, name: 'Vegan House', category: 'restos', location: 'Mouvaux', distance: 1.3, emoji: '🥗', filters: ['takeaway', 'wifi', 'terrasse', 'pets'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 20 20', email: 'contact@veganhouse.fr', googleMapsUrl: 'https://maps.google.com/?q=Vegan+House', googleReviewsUrl: 'https://g.page/veganhouse', instagram: 'https://instagram.com/veganhouse', website: 'https://veganhouse.fr' },

  // CLUBS - 10 établissements
  { id: 21, name: 'Drops Club', category: 'clubs', location: 'Lys-lez-Lannoy', distance: 1.8, emoji: '💧', filters: ['happyhour', 'parking', 'concerts'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 21 21', email: 'contact@drops.fr', googleMapsUrl: 'https://maps.google.com/?q=Drops+Club', googleReviewsUrl: 'https://g.page/drops', instagram: 'https://instagram.com/drops', website: 'https://drops.fr' },
  { id: 22, name: 'La Nuit Club', category: 'clubs', location: 'Roubaix', distance: 2.3, emoji: '🌙', filters: ['concerts', 'happyhour', 'metro', 'parking'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 22 22', email: 'contact@lanuitclub.fr', googleMapsUrl: 'https://maps.google.com/?q=La+Nuit+Club', googleReviewsUrl: 'https://g.page/lanuitclub', instagram: 'https://instagram.com/lanuitclub', website: 'https://lanuitclub.fr' },
  { id: 23, name: 'Electric Pulse', category: 'clubs', location: 'Croix', distance: 1.6, emoji: '⚡', filters: ['concerts', 'wifi', 'parking', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 23 23', email: 'contact@electricpulse.fr', googleMapsUrl: 'https://maps.google.com/?q=Electric+Pulse', googleReviewsUrl: 'https://g.page/electricpulse', instagram: 'https://instagram.com/electricpulse', website: 'https://electricpulse.fr' },
  { id: 24, name: 'Disco Fever', category: 'clubs', location: 'Mouvaux', distance: 0.9, emoji: '🕺', filters: ['concerts', 'parking', 'happyhour'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 24 24', email: 'contact@discofever.fr', googleMapsUrl: 'https://maps.google.com/?q=Disco+Fever', googleReviewsUrl: 'https://g.page/discofever', instagram: 'https://instagram.com/discofever', website: 'https://discofever.fr' },
  { id: 25, name: 'Boom Lounge', category: 'clubs', location: 'Tourcoing', distance: 2.1, emoji: '🎧', filters: ['concerts', 'metro', 'wifi', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 25 25', email: 'contact@boomlounge.fr', googleMapsUrl: 'https://maps.google.com/?q=Boom+Lounge', googleReviewsUrl: 'https://g.page/boomlounge', instagram: 'https://instagram.com/boomlounge', website: 'https://boomlounge.fr' },
  { id: 26, name: 'The Mix', category: 'clubs', location: 'Roubaix', distance: 2.4, emoji: '🎵', filters: ['concerts', 'parking', 'wifi'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 26 26', email: 'contact@themix.fr', googleMapsUrl: 'https://maps.google.com/?q=The+Mix', googleReviewsUrl: 'https://g.page/themix', instagram: 'https://instagram.com/themix', website: 'https://themix.fr' },
  { id: 27, name: 'Vinyl Underground', category: 'clubs', location: 'Croix', distance: 1.3, emoji: '🎚️', filters: ['concerts', 'metro', 'parking', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 27 27', email: 'contact@vinylunderground.fr', googleMapsUrl: 'https://maps.google.com/?q=Vinyl+Underground', googleReviewsUrl: 'https://g.page/vinylunderground', instagram: 'https://instagram.com/vinylunderground', website: 'https://vinylunderground.fr' },
  { id: 28, name: 'Club Essence', category: 'clubs', location: 'Mouvaux', distance: 1.1, emoji: '✨', filters: ['concerts', 'happyhour', 'wifi'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 28 28', email: 'contact@clubessence.fr', googleMapsUrl: 'https://maps.google.com/?q=Club+Essence', googleReviewsUrl: 'https://g.page/clubessence', instagram: 'https://instagram.com/clubessence', website: 'https://clubessence.fr' },
  { id: 29, name: 'Deep House', category: 'clubs', location: 'Tourcoing', distance: 2.0, emoji: '🏠', filters: ['concerts', 'parking', 'metro'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 29 29', email: 'contact@deephouse.fr', googleMapsUrl: 'https://maps.google.com/?q=Deep+House', googleReviewsUrl: 'https://g.page/deephouse', instagram: 'https://instagram.com/deephouse', website: 'https://deephouse.fr' },
  { id: 30, name: 'Techno Vibes', category: 'clubs', location: 'Roubaix', distance: 2.2, emoji: '🤖', filters: ['concerts', 'wifi', 'parking', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 30 30', email: 'contact@technovibes.fr', googleMapsUrl: 'https://maps.google.com/?q=Techno+Vibes', googleReviewsUrl: 'https://g.page/technovibes', instagram: 'https://instagram.com/technovibes', website: 'https://technovibes.fr' },

  // AUTRES - 10 établissements
  { id: 31, name: 'Café Moderne', category: 'other', location: 'Roubaix', distance: 2.3, emoji: '☕', filters: ['metro', 'parking', 'wifi', 'takeaway'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 31 31', email: 'contact@cafemodern.fr', googleMapsUrl: 'https://maps.google.com/?q=Cafe+Moderne', googleReviewsUrl: 'https://g.page/cafemodern', instagram: 'https://instagram.com/cafemodern', website: 'https://cafemodern.fr' },
  { id: 32, name: 'Le Brassin', category: 'other', location: 'Mouvaux', distance: 0.3, emoji: '🏭', filters: ['terrasse', 'games', 'concerts', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 32 32', email: 'contact@brassin.fr', googleMapsUrl: 'https://maps.google.com/?q=Le+Brassin', googleReviewsUrl: 'https://g.page/brassin', instagram: 'https://instagram.com/brassin', website: 'https://brassin.fr' },
  { id: 33, name: 'Bistro du Coin', category: 'other', location: 'Tourcoing', distance: 1.9, emoji: '🍷', filters: ['happyhour', 'metro', 'pets', 'wifi'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 33 33', email: 'contact@bistro.fr', googleMapsUrl: 'https://maps.google.com/?q=Bistro+du+Coin', googleReviewsUrl: 'https://g.page/bistro', instagram: 'https://instagram.com/bistro', website: 'https://bistro.fr' },
  { id: 34, name: 'Salle de Jeux', category: 'other', location: 'Mouvaux', distance: 1.0, emoji: '🎪', filters: ['games', 'parking', 'offers', 'pets'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 34 34', email: 'contact@sallejeux.fr', googleMapsUrl: 'https://maps.google.com/?q=Salle+de+Jeux', googleReviewsUrl: 'https://g.page/sallejeux', instagram: 'https://instagram.com/sallejeux', website: 'https://sallejeux.fr' },
  { id: 35, name: 'Billiard Club', category: 'other', location: 'Croix', distance: 1.4, emoji: '🎱', filters: ['games', 'wifi', 'parking', 'happyhour'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 35 35', email: 'contact@billardclub.fr', googleMapsUrl: 'https://maps.google.com/?q=Billiard+Club', googleReviewsUrl: 'https://g.page/billardclub', instagram: 'https://instagram.com/billardclub', website: 'https://billardclub.fr' },
  { id: 36, name: 'Board Game Arena', category: 'other', location: 'Mouvaux', distance: 0.7, emoji: '🃏', filters: ['games', 'wifi', 'pets', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 36 36', email: 'contact@boardgamearena.fr', googleMapsUrl: 'https://maps.google.com/?q=Board+Game+Arena', googleReviewsUrl: 'https://g.page/boardgamearena', instagram: 'https://instagram.com/boardgamearena', website: 'https://boardgamearena.fr' },
  { id: 37, name: 'Outdoor Terrace', category: 'other', location: 'Tourcoing', distance: 2.1, emoji: '⛺', filters: ['terrasse', 'pets', 'parking', 'happyhour'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 37 37', email: 'contact@outdoorterrace.fr', googleMapsUrl: 'https://maps.google.com/?q=Outdoor+Terrace', googleReviewsUrl: 'https://g.page/outdoorterrace', instagram: 'https://instagram.com/outdoorterrace', website: 'https://outdoorterrace.fr' },
  { id: 38, name: 'Comedy Club', category: 'other', location: 'Roubaix', distance: 2.2, emoji: '🎤', filters: ['concerts', 'parking', 'wifi', 'metro'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 38 38', email: 'contact@comedyclub.fr', googleMapsUrl: 'https://maps.google.com/?q=Comedy+Club', googleReviewsUrl: 'https://g.page/comedyclub', instagram: 'https://instagram.com/comedyclub', website: 'https://comedyclub.fr' },
  { id: 39, name: 'Art Lounge', category: 'other', location: 'Croix', distance: 1.7, emoji: '🎨', filters: ['wifi', 'parking', 'pets', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 39 39', email: 'contact@artlounge.fr', googleMapsUrl: 'https://maps.google.com/?q=Art+Lounge', googleReviewsUrl: 'https://g.page/artlounge', instagram: 'https://instagram.com/artlounge', website: 'https://artlounge.fr' },
  { id: 40, name: 'Reading Room', category: 'other', location: 'Mouvaux', distance: 0.5, emoji: '📚', filters: ['wifi', 'terrasse', 'pets', 'takeaway'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 40 40', email: 'contact@readingroom.fr', googleMapsUrl: 'https://maps.google.com/?q=Reading+Room', googleReviewsUrl: 'https://g.page/readingroom', instagram: 'https://instagram.com/readingroom', website: 'https://readingroom.fr' },

  // ÉVÉNEMENTIEL - 10 établissements
  { id: 41, name: 'Salle Événement Premium', category: 'events', location: 'Mouvaux', distance: 1.2, emoji: '🎊', filters: ['parking', 'wifi', 'metro'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 41 41', email: 'contact@sallepremium.fr', googleMapsUrl: 'https://maps.google.com/?q=Salle+Premium', googleReviewsUrl: 'https://g.page/sallepremium', instagram: 'https://instagram.com/sallepremium', website: 'https://sallepremium.fr' },
  { id: 42, name: 'Grand Hall', category: 'events', location: 'Croix', distance: 1.5, emoji: '🏛️', filters: ['parking', 'wifi', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 42 42', email: 'contact@grandhall.fr', googleMapsUrl: 'https://maps.google.com/?q=Grand+Hall', googleReviewsUrl: 'https://g.page/grandhall', instagram: 'https://instagram.com/grandhall', website: 'https://grandhall.fr' },
  { id: 43, name: 'Wedding Venue', category: 'events', location: 'Roubaix', distance: 2.0, emoji: '💒', filters: ['parking', 'pets', 'parking'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 43 43', email: 'contact@weddingvenue.fr', googleMapsUrl: 'https://maps.google.com/?q=Wedding+Venue', googleReviewsUrl: 'https://g.page/weddingvenue', instagram: 'https://instagram.com/weddingvenue', website: 'https://weddingvenue.fr' },
  { id: 44, name: 'Corporate Space', category: 'events', location: 'Mouvaux', distance: 0.9, emoji: '🏢', filters: ['wifi', 'parking', 'metro'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 44 44', email: 'contact@corporatespace.fr', googleMapsUrl: 'https://maps.google.com/?q=Corporate+Space', googleReviewsUrl: 'https://g.page/corporatespace', instagram: 'https://instagram.com/corporatespace', website: 'https://corporatespace.fr' },
  { id: 45, name: 'Exhibition Center', category: 'events', location: 'Tourcoing', distance: 2.2, emoji: '🖼️', filters: ['parking', 'wifi', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 45 45', email: 'contact@exhibitioncenter.fr', googleMapsUrl: 'https://maps.google.com/?q=Exhibition+Center', googleReviewsUrl: 'https://g.page/exhibitioncenter', instagram: 'https://instagram.com/exhibitioncenter', website: 'https://exhibitioncenter.fr' },
  { id: 46, name: 'Festival Grounds', category: 'events', location: 'Roubaix', distance: 2.3, emoji: '🎪', filters: ['parking', 'metro', 'concerts'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 46 46', email: 'contact@festivalgrounds.fr', googleMapsUrl: 'https://maps.google.com/?q=Festival+Grounds', googleReviewsUrl: 'https://g.page/festivalgrounds', instagram: 'https://instagram.com/festivalgrounds', website: 'https://festivalgrounds.fr' },
  { id: 47, name: 'Party Palace', category: 'events', location: 'Croix', distance: 1.3, emoji: '🎉', filters: ['parking', 'wifi', 'offers'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 47 47', email: 'contact@partypalace.fr', googleMapsUrl: 'https://maps.google.com/?q=Party+Palace', googleReviewsUrl: 'https://g.page/partypalace', instagram: 'https://instagram.com/partypalace', website: 'https://partypalace.fr' },
  { id: 48, name: 'Banquet Hall', category: 'events', location: 'Mouvaux', distance: 1.1, emoji: '🍽️', filters: ['parking', 'wifi', 'metro'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 48 48', email: 'contact@banquethall.fr', googleMapsUrl: 'https://maps.google.com/?q=Banquet+Hall', googleReviewsUrl: 'https://g.page/banquethall', instagram: 'https://instagram.com/banquethall', website: 'https://banquethall.fr' },
  { id: 49, name: 'Conference Room Pro', category: 'events', location: 'Tourcoing', distance: 2.0, emoji: '📊', filters: ['wifi', 'parking', 'metro'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 49 49', email: 'contact@conferenceroom.fr', googleMapsUrl: 'https://maps.google.com/?q=Conference+Room', googleReviewsUrl: 'https://g.page/conferenceroom', instagram: 'https://instagram.com/conferenceroom', website: 'https://conferenceroom.fr' },
  { id: 50, name: 'Show Theater', category: 'events', location: 'Roubaix', distance: 2.1, emoji: '🎬', filters: ['parking', 'metro', 'concerts'], profilePhoto: null, postPhoto: null, phone: '+33 3 20 55 50 50', email: 'contact@showtheater.fr', googleMapsUrl: 'https://maps.google.com/?q=Show+Theater', googleReviewsUrl: 'https://g.page/showtheater', instagram: 'https://instagram.com/showtheater', website: 'https://showtheater.fr' },
]

const POSTS = [
  { id: 1, barId: 1, description: 'Ta bière 33cl au prix de la 25cl!', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Ta bière 33cl au prix de la 25cl!', offerSubDesc: 'Valable sur nos becs 1 à 5, sur présentation de l\'appli' },
  { id: 2, barId: 2, description: 'Happy hour 17h-19h: -30% sur les bières 🍻', isSpecialOffer: false },
  { id: 3, barId: 3, description: 'Terrasse disponible maintenant! ☀️', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Terrasse gratuite', offerSubDesc: 'Venez profiter de notre belle terrasse' },
  { id: 4, barId: 4, description: 'Soirée chill ce soir 🎶', isSpecialOffer: false },
  { id: 5, barId: 5, description: 'Apéritif dinatoire gratuit à partir de 20h ✨', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Apéritif gratuit', offerSubDesc: 'À partir de 20h tous les soirs' },
  { id: 6, barId: 6, description: 'Nouveau cocktail spécial 🍹', isSpecialOffer: false },
  { id: 7, barId: 7, description: 'Café et pâtisserie fraîche ☕', isSpecialOffer: false },
  { id: 8, barId: 8, description: 'Concerts live ce weekend 🎤', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Entrée gratuite avant 21h', offerSubDesc: 'Sur présentation de ce code' },
  { id: 9, barId: 9, description: 'Tapas à volonté 🥘', isSpecialOffer: false },
  { id: 10, barId: 10, description: 'Happy hour chaque jour 17h-19h', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: '-40% happy hour', offerSubDesc: 'De 17h à 19h tous les jours' },
  { id: 11, barId: 11, description: 'Menu du jour: plat + verre de vin 12€ 🍷', isSpecialOffer: false },
  { id: 12, barId: 12, description: 'Bière artisanale du mois 🏭', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Dégustation gratuite', offerSubDesc: 'Goûtez notre nouvelle bière' },
  { id: 13, barId: 13, description: 'Cours de cuisine le weekend', isSpecialOffer: false },
  { id: 14, barId: 14, description: 'Pizza taille XL à -25% 🍕', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Pizza XL -25%', offerSubDesc: 'À emporter ou sur place' },
  { id: 15, barId: 15, description: 'Menu express 15min 🍣', isSpecialOffer: false },
  { id: 16, barId: 16, description: 'Menu burger + frites + boisson', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Menu complet 9.99€', offerSubDesc: 'Valable à emporter seulement' },
  { id: 17, barId: 17, description: 'Soirée France le jeudi', isSpecialOffer: false },
  { id: 18, barId: 18, description: 'Pad Thaï spécial -30% 🍜', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Pad Thaï -30%', offerSubDesc: 'Tous les jours jusqu\'à 19h' },
  { id: 19, barId: 19, description: 'Côte de boeuf grillée', isSpecialOffer: false },
  { id: 20, barId: 20, description: 'Menu vegan 100% bio 🥗', isSpecialOffer: true, specialOfferCode: '1234', offerTitle: 'Menu vegan -20%', offerSubDesc: 'Tous les produits frais du jour' },
]

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
    const [floatingHearts, setFloatingHearts] = useState<number[]>([])

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
          {FILTER_OPTIONS.map((filter) => (
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
                        const filter = FILTER_OPTIONS.find((opt) => opt.id === f)
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
                      <button onClick={() => toggleLike(bar.id)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: likes[bar.id] ? '#FF6B35' : '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                        <span style={{ fontSize: '20px', display: 'inline-block', transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', transform: likes[bar.id] ? 'scale(1.3) rotate(0deg)' : 'scale(1)', filter: likes[bar.id] ? 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.6))' : 'none' }}>
                          {likes[bar.id] ? '❤️' : '🤍'}
                        </span>
                        {likeCount[bar.id] || 0}
                        {/* Coeurs flottants au like */}
                        {likes[bar.id] && [...Array(3)].map((_, i) => (
                          <div
                            key={`like-heart-${i}`}
                            style={{
                              position: 'fixed',
                              pointerEvents: 'none',
                              fontSize: '20px',
                              left: 'calc(100% - 60px)',
                              top: 'calc(100% - 20px)',
                              animation: `heart-float 1.5s ease-out ${i * 0.2}s forwards`,
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
