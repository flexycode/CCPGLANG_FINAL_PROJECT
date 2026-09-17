import React from 'react';

type StatusType = 'present' | 'absent' | 'late' | 'excused' | 'enrolled' | 'pass' | 'select';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getStyles = () => {
    switch (status) {
      case 'present':
      case 'pass':
      case 'enrolled':
        return { bg: 'var(--status-present-bg)', text: 'var(--status-present-text)' };
      case 'absent':
        return { bg: 'var(--status-absent-bg)', text: 'var(--status-absent-text)' };
      case 'late':
        return { bg: 'var(--status-late-bg)', text: 'var(--status-late-text)' };
      case 'excused':
      case 'select':
      default:
        return { bg: 'var(--bg-secondary)', text: 'var(--text-muted)' };
    }
  };

  const currentStyles = getStyles();

  const badgeStyle = {
    backgroundColor: currentStyles.bg,
    color: currentStyles.text,
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 600,
    display: 'inline-block',
    textTransform: 'capitalize' as const,
  };

  return (
    <span style={badgeStyle}>
      {label || status}
    </span>
  );
};

export default StatusBadge;
