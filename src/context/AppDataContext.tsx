import React, { createContext, useContext, useState } from 'react';
import { CitizenReport, Establishment } from '../types';
import { evaluateAccessibility, generateId } from '../lib/accessibility';
import {
  loadEstablishments,
  loadReports,
  saveEstablishments,
  saveReports,
} from '../lib/storage';

export interface NewEstablishmentInput {
  name: string;
  address: string;
  locality: string;
  latitude: number;
  longitude: number;
  entranceWidthCm: number;
  hasSteps: boolean;
  photoDataUrl?: string;
}

export interface AddEstablishmentResult {
  establishment: Establishment;
  savedWithoutPhoto: boolean;
}

interface AppDataContextValue {
  establishments: Establishment[];
  reports: CitizenReport[];
  storageWarning: string | null;
  dismissStorageWarning: () => void;
  addEstablishment: (input: NewEstablishmentInput) => AddEstablishmentResult;
  addReport: (establishmentId: string, description: string) => CitizenReport;
  resolveReport: (reportId: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialState] = useState(() => {
    const estResult = loadEstablishments();
    const repResult = loadReports();
    const warnings = [estResult.warning, repResult.warning].filter(Boolean);
    return {
      establishments: estResult.data,
      reports: repResult.data,
      warning: warnings.length > 0 ? warnings.join(' ') : null,
    };
  });

  const [establishments, setEstablishments] = useState<Establishment[]>(
    initialState.establishments
  );
  const [reports, setReports] = useState<CitizenReport[]>(initialState.reports);
  const [storageWarning, setStorageWarning] = useState<string | null>(
    initialState.warning
  );

  const addEstablishment = (
    input: NewEstablishmentInput
  ): AddEstablishmentResult => {
    const status = evaluateAccessibility(input.entranceWidthCm, input.hasSteps);
    const created: Establishment = {
      id: generateId(),
      name: input.name.trim(),
      address: input.address.trim(),
      locality: input.locality.trim(),
      latitude: input.latitude,
      longitude: input.longitude,
      entranceWidthCm: input.entranceWidthCm,
      hasSteps: input.hasSteps,
      photoDataUrl: input.photoDataUrl || undefined,
      status,
      createdAt: new Date().toISOString(),
    };

    const candidateList = [created, ...establishments];
    const saveResult = saveEstablishments(candidateList);

    const persistedEstablishment: Establishment = saveResult.savedWithoutPhoto
      ? { ...created, photoDataUrl: undefined }
      : created;

    const finalList = saveResult.savedWithoutPhoto
      ? [persistedEstablishment, ...establishments]
      : candidateList;

    setEstablishments(finalList);
    if (saveResult.warning) {
      setStorageWarning(saveResult.warning);
    }

    return {
      establishment: persistedEstablishment,
      savedWithoutPhoto: Boolean(saveResult.savedWithoutPhoto),
    };
  };

  const addReport = (
    establishmentId: string,
    description: string
  ): CitizenReport => {
    const created: CitizenReport = {
      id: generateId(),
      establishmentId,
      description: description.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    const nextReports = [created, ...reports];
    const saveResult = saveReports(nextReports);
    setReports(nextReports);
    if (saveResult.warning) {
      setStorageWarning(saveResult.warning);
    }
    return created;
  };

  const resolveReport = (reportId: string): void => {
    const nextReports = reports.map((report) =>
      report.id === reportId ? { ...report, status: 'resolved' as const } : report
    );
    const saveResult = saveReports(nextReports);
    setReports(nextReports);
    if (saveResult.warning) {
      setStorageWarning(saveResult.warning);
    }
  };

  const dismissStorageWarning = () => setStorageWarning(null);

  return (
    <AppDataContext.Provider
      value={{
        establishments,
        reports,
        storageWarning,
        dismissStorageWarning,
        addEstablishment,
        addReport,
        resolveReport,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData tem de ser utilizado dentro de AppDataProvider.');
  }
  return ctx;
}
