// Animation CSS pour les cœurs flottants
export const HEART_ANIMATIONS_CSS = `
  @keyframes floatHearts {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-150px) scale(0.4);
    }
  }

  .heart-float {
    position: fixed;
    font-size: 20px;
    z-index: 9999;
    pointer-events: none;
    user-select: none;
    animation: floatHearts 1.8s ease-out forwards;
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
