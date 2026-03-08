import { Vehicle, Inspection, DamageReport, Driver, ActivityItem, MaintenancePrediction } from '@/types';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    number: 'CAB-1234',
    make: 'Toyota',
    model: 'KDH Van',
    year: 2020,
    type: 'van',
    status: 'available',
    healthScore: 92,
    lastInspection: '2026-01-18',
    currentMileage: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400',
    location: {
      lat: 6.9271,
      lng: 79.8612,
      address: 'Colombo Depot'
    }
  },
  {
    id: '2',
    number: 'VAN-5678',
    make: 'Toyota',
    model: 'Hiace',
    year: 2019,
    type: 'van',
    status: 'in-use',
    healthScore: 85,
    lastInspection: '2026-01-17',
    currentMileage: 62000,
    imageUrl: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400',
    currentAssignment: {
      customerName: 'John Smith',
      returnDate: '2026-01-22'
    },
    location: {
      lat: 7.2906,
      lng: 80.6337,
      address: 'Kandy'
    }
  },
  {
    id: '3',
    number: 'CAR-9012',
    make: 'Suzuki',
    model: 'Every',
    year: 2021,
    type: 'car',
    status: 'available',
    healthScore: 95,
    lastInspection: '2026-01-18',
    currentMileage: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    location: {
      lat: 6.9271,
      lng: 79.8612,
      address: 'Colombo Depot'
    }
  },
  {
    id: '4',
    number: 'TUK-3456',
    make: 'Bajaj',
    model: 'RE Auto',
    year: 2022,
    type: 'tuk-tuk',
    status: 'available',
    healthScore: 88,
    lastInspection: '2026-01-16',
    currentMileage: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    location: {
      lat: 6.9271,
      lng: 79.8612,
      address: 'Colombo Depot'
    }
  },
  {
    id: '5',
    number: 'SUV-7890',
    make: 'Toyota',
    model: 'Prado',
    year: 2021,
    type: 'suv',
    status: 'needs-repair',
    healthScore: 65,
    lastInspection: '2026-01-15',
    currentMileage: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    location: {
      lat: 6.9271,
      lng: 79.8612,
      address: 'Colombo Depot - Service Bay'
    }
  },
  {
    id: '6',
    number: 'CAB-2468',
    make: 'Nissan',
    model: 'Caravan',
    year: 2018,
    type: 'van',
    status: 'in-use',
    healthScore: 78,
    lastInspection: '2026-01-17',
    currentMileage: 98000,
    imageUrl: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400',
    currentAssignment: {
      customerName: 'Sarah Johnson',
      returnDate: '2026-01-20'
    },
    location: {
      lat: 6.0535,
      lng: 80.2210,
      address: 'Galle'
    }
  },
  {
    id: '7',
    number: 'CAR-1357',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    type: 'car',
    status: 'critical',
    healthScore: 45,
    lastInspection: '2026-01-10',
    currentMileage: 72000,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    location: {
      lat: 6.9271,
      lng: 79.8612,
      address: 'Colombo Depot - Repair Shop'
    }
  },
  {
    id: '8',
    number: 'VAN-8642',
    make: 'Toyota',
    model: 'KDH Van',
    year: 2022,
    type: 'van',
    status: 'available',
    healthScore: 98,
    lastInspection: '2026-01-19',
    currentMileage: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400',
    location: {
      lat: 6.9271,
      lng: 79.8612,
      address: 'Colombo Depot'
    }
  }
];

export const mockInspections: Inspection[] = [
  {
    id: '1',
    vehicleNumber: 'CAB-1234',
    vehicleName: 'Toyota KDH Van',
    driverName: 'Kamal Perera',
    customerName: 'Michael Brown',
    date: '2026-01-18T10:30:00',
    type: 'check-out',
    conditionScore: 92,
    damagesFound: 0,
    status: 'complete',
    photos: []
  },
  {
    id: '2',
    vehicleNumber: 'VAN-5678',
    vehicleName: 'Toyota Hiace',
    driverName: 'Nimal Silva',
    customerName: 'John Smith',
    date: '2026-01-17T09:15:00',
    type: 'check-out',
    conditionScore: 85,
    damagesFound: 2,
    status: 'complete',
    photos: [],
    damages: [
      {
        id: '1',
        type: 'scratch',
        severity: 'minor',
        location: 'Front bumper, driver side',
        description: 'Small scratch on front bumper',
        photoUrl: '',
        aiConfidence: 95,
        estimatedCost: 5000
      }
    ]
  },
  {
    id: '3',
    vehicleNumber: 'CAB-2468',
    vehicleName: 'Nissan Caravan',
    driverName: 'Sunil Fernando',
    customerName: 'Sarah Johnson',
    date: '2026-01-17T14:20:00',
    type: 'check-in',
    conditionScore: 78,
    damagesFound: 3,
    status: 'disputed',
    photos: []
  },
  {
    id: '4',
    vehicleNumber: 'TUK-3456',
    vehicleName: 'Bajaj RE Auto',
    driverName: 'Ravi Kumar',
    customerName: 'Emma Wilson',
    date: '2026-01-16T11:45:00',
    type: 'check-out',
    conditionScore: 88,
    damagesFound: 1,
    status: 'complete',
    photos: []
  },
  {
    id: '5',
    vehicleNumber: 'SUV-7890',
    vehicleName: 'Toyota Prado',
    driverName: 'Ajith Bandara',
    customerName: 'David Lee',
    date: '2026-01-15T16:00:00',
    type: 'check-in',
    conditionScore: 65,
    damagesFound: 5,
    status: 'complete',
    photos: []
  }
];

export const mockDamageReports: DamageReport[] = [
  {
    id: '1',
    vehicleNumber: 'VAN-5678',
    vehicleType: 'Toyota Hiace',
    vehicleImageUrl: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400',
    damage: {
      id: '1',
      type: 'scratch',
      severity: 'minor',
      location: 'Front bumper, driver side',
      description: 'Small scratch, approximately 3 inches long',
      photoUrl: '',
      aiConfidence: 95,
      estimatedCost: 5000
    },
    dateDetected: '2026-01-17T09:15:00',
    customerInvolved: 'John Smith',
    status: 'pending'
  },
  {
    id: '2',
    vehicleNumber: 'SUV-7890',
    vehicleType: 'Toyota Prado',
    vehicleImageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    damage: {
      id: '2',
      type: 'dent',
      severity: 'moderate',
      location: 'Rear door, passenger side',
      description: 'Dent approximately 2 inches in diameter',
      photoUrl: '',
      aiConfidence: 88,
      estimatedCost: 15000
    },
    dateDetected: '2026-01-15T16:00:00',
    customerInvolved: 'David Lee',
    status: 'pending'
  },
  {
    id: '3',
    vehicleNumber: 'CAR-1357',
    vehicleType: 'Toyota Corolla',
    vehicleImageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    damage: {
      id: '3',
      type: 'broken-light',
      severity: 'severe',
      location: 'Front headlight, driver side',
      description: 'Headlight cracked and non-functional',
      photoUrl: '',
      aiConfidence: 99,
      estimatedCost: 25000
    },
    dateDetected: '2026-01-10T13:30:00',
    status: 'insurance-claimed'
  }
];

export const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Kamal Perera',
    employeeId: 'EMP-001',
    phone: '+94 77 123 4567',
    licenseExpiry: '2027-06-15',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    performanceScore: 95,
    totalInspections: 245,
    damageIncidentRate: 2.5,
    status: 'on-duty'
  },
  {
    id: '2',
    name: 'Nimal Silva',
    employeeId: 'EMP-002',
    phone: '+94 77 234 5678',
    licenseExpiry: '2026-11-20',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    performanceScore: 88,
    totalInspections: 198,
    damageIncidentRate: 4.2,
    status: 'on-duty'
  },
  {
    id: '3',
    name: 'Sunil Fernando',
    employeeId: 'EMP-003',
    phone: '+94 77 345 6789',
    licenseExpiry: '2028-03-10',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    performanceScore: 92,
    totalInspections: 312,
    damageIncidentRate: 1.8,
    status: 'available'
  },
  {
    id: '4',
    name: 'Ravi Kumar',
    employeeId: 'EMP-004',
    phone: '+94 77 456 7890',
    licenseExpiry: '2027-08-25',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    performanceScore: 85,
    totalInspections: 156,
    damageIncidentRate: 5.1,
    status: 'on-duty'
  },
  {
    id: '5',
    name: 'Ajith Bandara',
    employeeId: 'EMP-005',
    phone: '+94 77 567 8901',
    licenseExpiry: '2026-12-30',
    photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100',
    performanceScore: 90,
    totalInspections: 228,
    damageIncidentRate: 3.2,
    status: 'available'
  }
];

export const mockActivities: ActivityItem[] = [
  {
    id: '1',
    time: '10:30 AM',
    vehicle: 'CAB-1234',
    driver: 'Kamal Perera',
    customer: 'Michael Brown',
    type: 'check-out',
    status: 'completed'
  },
  {
    id: '2',
    time: '11:00 AM',
    vehicle: 'VAN-8642',
    driver: 'Nimal Silva',
    customer: 'Lisa Anderson',
    type: 'check-out',
    status: 'scheduled'
  },
  {
    id: '3',
    time: '02:00 PM',
    vehicle: 'CAB-2468',
    driver: 'Sunil Fernando',
    customer: 'Sarah Johnson',
    type: 'check-in',
    status: 'scheduled'
  },
  {
    id: '4',
    time: '03:30 PM',
    vehicle: 'TUK-3456',
    driver: 'Ravi Kumar',
    customer: 'Tom Harris',
    type: 'check-out',
    status: 'scheduled'
  }
];

export const mockMaintenancePredictions: MaintenancePrediction[] = [
  {
    id: '1',
    vehicleNumber: 'CAB-2468',
    predictedIssue: 'Brake pad replacement needed',
    confidence: 87,
    recommendedDate: '2026-01-25',
    priority: 'high'
  },
  {
    id: '2',
    vehicleNumber: 'SUV-7890',
    predictedIssue: 'Engine oil service due',
    confidence: 92,
    recommendedDate: '2026-01-22',
    priority: 'high'
  },
  {
    id: '3',
    vehicleNumber: 'VAN-5678',
    predictedIssue: 'Tire rotation recommended',
    confidence: 75,
    recommendedDate: '2026-02-01',
    priority: 'medium'
  },
  {
    id: '4',
    vehicleNumber: 'CAR-9012',
    predictedIssue: 'Air filter replacement',
    confidence: 68,
    recommendedDate: '2026-02-10',
    priority: 'low'
  }
];
