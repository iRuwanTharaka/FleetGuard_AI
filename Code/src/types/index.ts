export type VehicleStatus = 'available' | 'in-use' | 'needs-repair' | 'critical';

export interface Vehicle {
  id: string;
  number: string;
  make: string;
  model: string;
  year: number;
  type: 'van' | 'car' | 'suv' | 'tuk-tuk';
  status: VehicleStatus;
  healthScore: number;
  lastInspection: string;
  currentMileage: number;
  imageUrl: string;
  currentAssignment?: {
    customerName: string;
    returnDate: string;
  };
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Inspection {
  id: string;
  vehicleNumber: string;
  vehicleName: string;
  driverName: string;
  customerName: string;
  date: string;
  type: 'check-out' | 'check-in';
  conditionScore: number;
  damagesFound: number;
  status: 'complete' | 'pending' | 'disputed';
  photos: string[];
  damages?: Damage[];
}

export interface Damage {
  id: string;
  type: 'scratch' | 'dent' | 'broken-light' | 'broken-mirror' | 'other';
  severity: 'minor' | 'moderate' | 'severe';
  location: string;
  description: string;
  photoUrl: string;
  aiConfidence: number;
  estimatedCost?: number;
}

export interface DamageReport {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleImageUrl: string;
  damage: Damage;
  dateDetected: string;
  customerInvolved?: string;
  status: 'pending' | 'repaired' | 'insurance-claimed';
}

export interface Driver {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  licenseExpiry: string;
  photoUrl: string;
  performanceScore: number;
  totalInspections: number;
  damageIncidentRate: number;
  status: 'available' | 'on-duty' | 'off-duty';
}

export interface ActivityItem {
  id: string;
  time: string;
  vehicle: string;
  driver: string;
  customer: string;
  type: 'check-out' | 'check-in';
  status: 'scheduled' | 'in-progress' | 'completed';
}

export interface MaintenancePrediction {
  id: string;
  vehicleNumber: string;
  predictedIssue: string;
  confidence: number;
  recommendedDate: string;
  priority: 'low' | 'medium' | 'high';
}
