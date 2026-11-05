import React from 'react';
import { AccessibilityStatus } from '../types';
import { getStatusLabel, getStatusSymbol } from '../lib/accessibility';

interface StatusBadgeProps {
  status: AccessibilityStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`status-badge status-${status}`}>
      <span className="status-badge-symbol" aria-hidden="true">
        {getStatusSymbol(status)}
      </span>
      <span>{getStatusLabel(status)}</span>
    </span>
  );
};
