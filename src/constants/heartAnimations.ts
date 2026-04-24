// Animation CSS pour les cœurs flottants spectaculaires
export const HEART_ANIMATIONS_CSS = `
  @keyframes floatHearts {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: drop-shadow(0 0 15px rgba(255, 107, 53, 1));
    }
    50% {
      opacity: 1;
      filter: drop-shadow(0 0 30px rgba(255, 107, 53, 1));
    }
    100% {
      opacity: 0;
      transform: translateY(-150vh) scale(0.3);
      filter: drop-shadow(0 0 5px rgba(255, 107, 53, 0));
    }
  }

  .heart-float {
    position: fixed;
    font-size: 48px;
    font-weight: bold;
    z-index: 9999;
    pointer-events: none;
    user-select: none;
    animation: floatHearts 2.5s ease-out forwards;
    color: #FF6B35;
  }

  .heart-float-1 {
    animation-delay: 0ms;
  }

  .heart-float-2 {
    animation-delay: 100ms;
  }

  .heart-float-3 {
    animation-delay: 200ms;
  }
`
