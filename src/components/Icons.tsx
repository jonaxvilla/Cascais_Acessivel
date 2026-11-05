import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const LocationPinIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M16 3C10.48 3 6 7.48 6 13c0 7.25 10 16 10 16s10-8.75 10-16c0-5.52-4.48-10-10-10z"
      fill="#00967A"
    />
    <circle cx="16" cy="13" r="4" fill="#FFFFFF" />
  </svg>
);

export const StorefrontIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 7h20v6H6V7z" fill="#1A1A1A" />
    <path d="M4 12h24v5H4v-5z" fill="#FF6B5F" />
    <path d="M9 12h4v5H9v-5zm10 0h4v5h-4v-5z" fill="#FFFFFF" />
    <rect x="6" y="17" width="20" height="11" rx="1" fill="#F2C62B" />
    <rect x="9" y="19" width="6" height="9" fill="#FFFFFF" />
    <rect x="17" y="19" width="6" height="6" fill="#FFFFFF" />
    <rect x="5" y="26" width="22" height="3" rx="1" fill="#1A1A1A" />
  </svg>
);

export const ReviewedCheckIcon: React.FC<IconProps> = ({
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="12" fill="#00967A" />
    <path
      d="M11 16.5l3.3 3.3L21.5 12.5"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MunicipalityHallIcon: React.FC<IconProps> = ({
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 4l4 2.5-4 2V4z" fill="#FF6B5F" />
    <path d="M5 13L16 7l11 6H5z" fill="#00967A" />
    <rect x="7" y="13" width="18" height="2.5" fill="#1A1A1A" />
    <rect x="8.5" y="15.5" width="2.5" height="9" fill="#F2C62B" />
    <rect x="14.75" y="15.5" width="2.5" height="9" fill="#F2C62B" />
    <rect x="21" y="15.5" width="2.5" height="9" fill="#F2C62B" />
    <rect x="5" y="24.5" width="22" height="3.5" rx="1" fill="#1A1A1A" />
  </svg>
);

export const StepFreeIcon: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M3 18h18V9L3 18z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const WideDoorIcon: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <rect
      x="7"
      y="3"
      width="10"
      height="18"
      rx="1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M3 12h4m10 0h4M14 12v.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const WheelchairIcon: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="11" cy="5" r="2" fill="currentColor" />
    <path
      d="M11 8v6h5l2 5M9.5 11.5a4.5 4.5 0 104.2 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
