interface FloatingButtonsProps {
  counts: {
    terrasse: number
    offre: number
    event: number
    happyHour: number
  }
  activeFilter: string | null
  onFilterToggle: (filter: string | null) => void
}

export function FloatingButtons({ counts, activeFilter, onFilterToggle }: FloatingButtonsProps) {
  return (
    <div
      style={{
        position: 'fixed',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 50,
      }}
    >
      {/* Terrasse */}
      <button
        onClick={() => onFilterToggle(activeFilter === 'terrasse' ? null : 'terrasse')}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: activeFilter === 'terrasse' ? '#FF6B35' : '#ffffff',
          border: `3px solid ${activeFilter === 'terrasse' ? '#FF6B35' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          transition: 'all 0.3s',
          fontSize: '24px',
          fontWeight: '700',
        }}
        title="Places libres en terrasse"
      >
        🏖️
        {counts.terrasse > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#FF6B35',
              color: 'white',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            {counts.terrasse}
          </div>
        )}
      </button>

      {/* Offre Spéciale */}
      <button
        onClick={() => onFilterToggle(activeFilter === 'offre' ? null : 'offre')}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: activeFilter === 'offre' ? '#DAA520' : '#ffffff',
          border: `3px solid ${activeFilter === 'offre' ? '#DAA520' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          transition: 'all 0.3s',
          fontSize: '24px',
          fontWeight: '700',
        }}
        title="Offres spéciales en cours"
      >
        🎁
        {counts.offre > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#DAA520',
              color: 'white',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            {counts.offre}
          </div>
        )}
      </button>

      {/* Événements */}
      <button
        onClick={() => onFilterToggle(activeFilter === 'event' ? null : 'event')}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: activeFilter === 'event' ? '#9C27B0' : '#ffffff',
          border: `3px solid ${activeFilter === 'event' ? '#9C27B0' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          transition: 'all 0.3s',
          fontSize: '24px',
          fontWeight: '700',
        }}
        title="Événements à venir"
      >
        🎪
        {counts.event > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#9C27B0',
              color: 'white',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            {counts.event}
          </div>
        )}
      </button>

      {/* Happy Hour */}
      <button
        onClick={() => onFilterToggle(activeFilter === 'happyHour' ? null : 'happyHour')}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: activeFilter === 'happyHour' ? '#4CAF50' : '#ffffff',
          border: `3px solid ${activeFilter === 'happyHour' ? '#4CAF50' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          transition: 'all 0.3s',
          fontSize: '24px',
          fontWeight: '700',
        }}
        title="Happy hour en cours"
      >
        ⏰
        {counts.happyHour > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            {counts.happyHour}
          </div>
        )}
      </button>
    </div>
  )
}
