export type AccessibilityStatus = 'accessible' | 'needs_review' | 'pending';

export type AppView = 'home' | 'citizen' | 'merchant' | 'municipality';

export interface Establishment {
  id: string;
  name: string;
  address: string;
  locality: string;
  latitude: number;
  longitude: number;
  entranceWidthCm: number | null;
  hasSteps: boolean | null;
  photoDataUrl?: string;
  status: AccessibilityStatus;
  createdAt: string;
  isDemoData?: boolean;
}

export interface CitizenReport {
  id: string;
  establishmentId: string;
  description: string;
  status: 'open' | 'resolved';
  createdAt: string;
  isDemoData?: boolean;
}
