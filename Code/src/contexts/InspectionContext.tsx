import { createContext, useContext, useState, ReactNode } from 'react';

export interface CustomerInfo {
  name: string;
  nicPassport: string;
  phone: string;
  rentalStartDate: string;
  rentalEndDate: string;
}

export interface PhotoData {
  id: string;
  label: string;
  file: File | null;
  preview: string | null;
  captured: boolean;
}

export interface DamageDetection {
  id: string;
  type: 'scratch' | 'dent' | 'crack' | 'broken';
  severity: 'minor' | 'moderate' | 'major';
  location: string;
  confidence: number;
  photoId: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface InspectionData {
  vehicleId: string | null;
  vehicleNumber: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  customerInfo: CustomerInfo | null;
  photos: PhotoData[];
  damages: DamageDetection[];
  healthScore: number | null;
  driverSignature: string | null;
  customerSignature: string | null;
  reportId: string | null;
  currentInspectionId: number | null;
}

interface InspectionContextType {
  inspection: InspectionData;
  setVehicle: (vehicleId: string, vehicleNumber: string, make: string, model: string, year: number) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  updatePhoto: (index: number, file: File, preview: string) => void;
  setPhotos: (photos: PhotoData[]) => void;
  processPhotos: () => Promise<void>;
  setDamages: (damages: DamageDetection[]) => void;
  setHealthScore: (score: number) => void;
  setDriverSignature: (signature: string) => void;
  setCustomerSignature: (signature: string) => void;
  generateReport: () => Promise<string>;
  resetInspection: () => void;
  currentInspectionId: number | null;
  setCurrentInspectionId: (id: number | null) => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

const INITIAL_PHOTOS: PhotoData[] = [
  { id: '1', label: 'Front View', file: null, preview: null, captured: false },
  { id: '2', label: 'Rear View', file: null, preview: null, captured: false },
  { id: '3', label: 'Left Side', file: null, preview: null, captured: false },
  { id: '4', label: 'Right Side', file: null, preview: null, captured: false },
  { id: '5', label: 'Interior', file: null, preview: null, captured: false },
  { id: '6', label: 'Dashboard/Odometer', file: null, preview: null, captured: false },
  { id: '7', label: 'Damage Close-up', file: null, preview: null, captured: false },
  { id: '8', label: 'Additional', file: null, preview: null, captured: false },
];

const INITIAL_INSPECTION: InspectionData = {
  vehicleId: null,
  vehicleNumber: null,
  vehicleMake: null,
  vehicleModel: null,
  vehicleYear: null,
  customerInfo: null,
  photos: INITIAL_PHOTOS,
  damages: [],
  healthScore: null,
  driverSignature: null,
  customerSignature: null,
  reportId: null,
  currentInspectionId: null,
};

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [inspection, setInspection] = useState<InspectionData>(INITIAL_INSPECTION);

  const setVehicle = (vehicleId: string, vehicleNumber: string, make: string, model: string, year: number) => {
    setInspection(prev => ({
      ...prev,
      vehicleId,
      vehicleNumber,
      vehicleMake: make,
      vehicleModel: model,
      vehicleYear: year,
    }));
  };

  const setCustomerInfo = (info: CustomerInfo) => {
    setInspection(prev => ({
      ...prev,
      customerInfo: info,
    }));
  };

  const updatePhoto = (index: number, file: File, preview: string) => {
    setInspection(prev => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = {
        ...newPhotos[index],
        file,
        preview,
        captured: true,
      };
      return { ...prev, photos: newPhotos };
    });
  };

  const setPhotos = (photos: PhotoData[]) => {
    setInspection(prev => ({ ...prev, photos }));
  };

  const processPhotos = async (): Promise<void> => {
    // Simulate AI processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock damage detection
        const mockDamages: DamageDetection[] = [
          {
            id: '1',
            type: 'scratch',
            severity: 'minor',
            location: 'Front bumper, driver side',
            confidence: 92,
            photoId: '1',
            boundingBox: { x: 120, y: 80, width: 60, height: 40 },
          },
          {
            id: '2',
            type: 'dent',
            severity: 'moderate',
            location: 'Rear door, passenger side',
            confidence: 88,
            photoId: '4',
            boundingBox: { x: 200, y: 150, width: 80, height: 70 },
          },
        ];

        // Calculate health score based on damages
        const baseScore = 100;
        const damageDeduction = mockDamages.reduce((total, damage) => {
          const severityPoints = {
            minor: 5,
            moderate: 10,
            major: 20,
          };
          return total + severityPoints[damage.severity];
        }, 0);

        const healthScore = Math.max(0, baseScore - damageDeduction);

        setInspection(prev => ({
          ...prev,
          damages: mockDamages,
          healthScore,
        }));

        resolve();
      }, 3000);
    });
  };

  const setDamages = (damages: DamageDetection[]) => {
    setInspection(prev => ({ ...prev, damages }));
  };

  const setHealthScore = (score: number) => {
    setInspection(prev => ({ ...prev, healthScore: score }));
  };

  const setDriverSignature = (signature: string) => {
    setInspection(prev => ({ ...prev, driverSignature: signature }));
  };

  const setCustomerSignature = (signature: string) => {
    setInspection(prev => ({ ...prev, customerSignature: signature }));
  };

  const generateReport = async (): Promise<string> => {
    // Simulate report generation
    return new Promise((resolve) => {
      setTimeout(() => {
        const reportId = `INS-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        setInspection(prev => ({ ...prev, reportId }));
        resolve(reportId);
      }, 1500);
    });
  };

  const resetInspection = () => {
    setInspection(INITIAL_INSPECTION);
  };

  const setCurrentInspectionId = (id: number | null) => {
    setInspection(prev => ({ ...prev, currentInspectionId: id }));
  };

  return (
    <InspectionContext.Provider
      value={{
        inspection,
        setVehicle,
        setCustomerInfo,
        updatePhoto,
        setPhotos,
        processPhotos,
        setDamages,
        setHealthScore,
        setDriverSignature,
        setCustomerSignature,
        generateReport,
        resetInspection,
        currentInspectionId: inspection.currentInspectionId,
        setCurrentInspectionId,
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection() {
  const context = useContext(InspectionContext);
  if (context === undefined) {
    throw new Error('useInspection must be used within an InspectionProvider');
  }
  return context;
}
