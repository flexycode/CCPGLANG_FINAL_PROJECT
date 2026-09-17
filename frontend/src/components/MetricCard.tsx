import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, highlight }) => {
  return (
    <div className="card" style={{ ...styles.card, ...(highlight ? styles.highlight : {}) }}>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.valueContainer}>
        <span style={styles.value}>{value}</span>
        {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  highlight: {
    borderLeft: '4px solid var(--brand-primary)',
  },
  title: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    margin: 0,
    fontFamily: 'var(--font-body)',
  },
  valueContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  }
};

export default MetricCard;
