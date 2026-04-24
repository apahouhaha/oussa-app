// DESIGN TOKENS
export const COLORS = {
  primary: '#FF6B35',    // Orange
  secondary: '#2C3E50',  // Gris foncé
  accent: '#FFD700',     // Or
  white: '#ffffff',
  bgLight: '#f5f5f5',
  bgLighter: '#f9f9f9',
  textDark: '#1a1a1a',
  textMid: '#666',
  textLight: '#999',
  error: '#ff4444',
  success: '#00aa00',
}

// ANIMATIONS CSS (à injecter dans <style> tag)
export const ANIMATIONS_CSS = `
  @keyframes heartPulse {
    0% { transform: scale(1); }
    25% { transform: scale(1.3); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
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
      transform: translateY(-150px) translateX(var(--tx, 0)) scale(0);
      opacity: 0;
    }
  }

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

  .confetti {
    position: fixed;
    pointer-events: none;
    animation: confetti-fall 2.5s ease-in forwards;
  }

  .heart-animation {
    animation: heartPulse 0.6s ease-in-out;
  }
`

// BREAKPOINTS
export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
}

// SPACING
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
}

// BORDER RADIUS
export const RADIUS = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
}

// SHADOWS
export const SHADOWS = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 2px 8px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 40px rgba(255, 107, 53, 0.4)',
}

// MESSAGES
export const MESSAGES = {
  login_intro: 'Quoi faire maintenant? Des idées fraîches, postées en direct',
  offers_instruction: 'Demande le code à ton commerçant, pour profiter de l\'offre!',
  offers_countdown: 'Valable jusqu\'à 20h30 aujourd\'hui',
  offers_validation: 'Tu as gagné 25 points!',
  no_results: 'Aucun établissement ne correspond à ta recherche',
}
