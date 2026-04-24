export const COLORS = {
  primary: '#FF6B35',
  secondary: '#2C3E50',
  accent: '#FFD700',
  background: '#ffffff',
  text: '#333',
  lightBg: '#f5f5f5',
  border: '#e0e0e0',
}

export const ANIMATIONS = `
  @keyframes floatHearts {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-100vh) scale(0.5);
    }
  }

  @keyframes glow {
    0%, 100% {
      text-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
    }
    50% {
      text-shadow: 0 0 30px rgba(255, 107, 53, 0.9);
    }
  }

  .heart-float {
    position: fixed;
    font-size: 28px;
    font-weight: bold;
    z-index: 9999;
    pointer-events: none;
    user-select: none;
    animation: floatHearts 2s ease-out forwards, glow 0.8s ease-in-out infinite;
    color: #FF6B35;
  }

  .heart-float-delay-1 {
    animation-delay: 0ms, 0ms;
  }

  .heart-float-delay-2 {
    animation-delay: 100ms, 100ms;
  }

  .heart-float-delay-3 {
    animation-delay: 200ms, 200ms;
  }
`

export const STYLES = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: COLORS.background,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    backgroundColor: COLORS.primary,
    color: 'white',
    padding: '16px 20px',
    fontSize: '20px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: COLORS.lightBg,
    overflowX: 'auto',
    borderBottom: `1px solid ${COLORS.border}`,
    scrollBehavior: 'smooth',
  },
  filterButton: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '20px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    color: 'white',
    borderColor: COLORS.primary,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 16px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '12px',
    padding: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${COLORS.border}`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.text,
  },
  likeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    padding: '4px 8px',
    transition: 'transform 0.2s ease',
  },
  likeButtonLiked: {
    transform: 'scale(1.2)',
  },
  cardMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: COLORS.accent,
    color: COLORS.text,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    color: '#999',
  },
}
