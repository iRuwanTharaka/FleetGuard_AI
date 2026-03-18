export interface PhotoPosition {
  id: number;
  key: string;
  label: string;
  instruction: string;
  tips: string[];
  required: boolean;
}

export const PHOTO_TEMPLATES: Record<string, PhotoPosition[]> = {
  default: [
    { id: 1, key: 'front', label: 'Front View', instruction: 'Ensure the entire front of the vehicle is visible', tips: ['Include full bumper, headlights, and license plate', 'Vehicle should fill 70-80% of the frame'], required: true },
    { id: 2, key: 'rear', label: 'Rear View', instruction: 'Capture the complete rear including license plate', tips: ['License plate must be clearly readable', 'Include tail lights and rear bumper'], required: true },
    { id: 3, key: 'left', label: 'Left Side', instruction: 'Show the full left side of the vehicle', tips: ['Capture entire vehicle from front to rear', 'Include all doors and windows'], required: true },
    { id: 4, key: 'right', label: 'Right Side', instruction: 'Show the full right side of the vehicle', tips: ['Capture entire vehicle from front to rear', 'Include all doors and windows'], required: true },
    { id: 5, key: 'interior', label: 'Interior / Dashboard', instruction: 'Capture the interior cabin and seats', tips: ['Show front and rear seats clearly', 'Include steering wheel and center console'], required: true },
    { id: 6, key: 'dashboard', label: 'Dashboard/Odometer', instruction: 'Clearly show the odometer reading', tips: ['Odometer numbers must be sharp and readable', 'Include fuel gauge and warning lights'], required: true },
    { id: 7, key: 'damage', label: 'Damage Close-up', instruction: 'Close-up of any visible damage (if any)', tips: ['Get within 1-2 feet of damage area', 'Ensure damage is clearly visible'], required: true },
    { id: 8, key: 'odometer', label: 'Additional', instruction: 'Any additional angles or damage areas', tips: ['Capture any special features or concerns', 'Document unique vehicle conditions'], required: true },
  ],
  tuktuk: [
    { id: 1, key: 'front', label: 'Front View', instruction: 'Ensure the entire front is visible', tips: ['Include full front view', 'Good lighting'], required: true },
    { id: 2, key: 'rear', label: 'Rear View', instruction: 'Capture the complete rear', tips: ['Include rear of tuk-tuk', 'License if visible'], required: true },
    { id: 3, key: 'left', label: 'Driver Side (Left)', instruction: 'Show the full left side', tips: ['Capture entire left side', 'Include driver area'], required: true },
    { id: 4, key: 'right', label: 'Passenger Side (Right)', instruction: 'Show the full right side', tips: ['Capture entire right side', 'Include passenger area'], required: true },
    { id: 5, key: 'engine', label: 'Engine Compartment', instruction: 'Capture the engine area', tips: ['Show engine clearly', 'Check for leaks'], required: true },
    { id: 6, key: 'canopy', label: 'Passenger Canopy', instruction: 'Capture the passenger canopy', tips: ['Show canopy condition', 'Include seating area'], required: true },
  ],
};

export function getPhotoTemplate(vehicleType?: string): PhotoPosition[] {
  return vehicleType === 'tuktuk' ? PHOTO_TEMPLATES.tuktuk : PHOTO_TEMPLATES.default;
}
