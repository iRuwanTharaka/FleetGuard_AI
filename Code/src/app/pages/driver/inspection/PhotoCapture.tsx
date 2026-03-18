import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Camera, RotateCcw, FlashlightOff, Flashlight, Grid3x3, X, Info, Check, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const PHOTO_LABELS = [
  { 
    id: 0, 
    label: 'Front View', 
    instruction: 'Ensure the entire front of the vehicle is visible',
    tips: [
      'Include full bumper, headlights, and license plate',
      'Vehicle should fill 70-80% of the frame',
      'Ensure good lighting without harsh shadows'
    ]
  },
  { 
    id: 1, 
    label: 'Rear View', 
    instruction: 'Capture the complete rear including license plate',
    tips: [
      'License plate must be clearly readable',
      'Include tail lights and rear bumper',
      'Stand 6-8 feet away for best angle'
    ]
  },
  { 
    id: 2, 
    label: 'Left Side', 
    instruction: 'Show the full left side of the vehicle',
    tips: [
      'Capture entire vehicle from front to rear',
      'Include all doors and windows',
      'Photo should be parallel to vehicle'
    ]
  },
  { 
    id: 3, 
    label: 'Right Side', 
    instruction: 'Show the full right side of the vehicle',
    tips: [
      'Capture entire vehicle from front to rear',
      'Include all doors and windows',
      'Photo should be parallel to vehicle'
    ]
  },
  { 
    id: 4, 
    label: 'Interior', 
    instruction: 'Capture the interior cabin and seats',
    tips: [
      'Show front and rear seats clearly',
      'Include steering wheel and center console',
      'Check for any stains or damage'
    ]
  },
  { 
    id: 5, 
    label: 'Dashboard/Odometer', 
    instruction: 'Clearly show the odometer reading',
    tips: [
      'Odometer numbers must be sharp and readable',
      'Include fuel gauge and warning lights',
      'Take photo straight-on to avoid glare'
    ]
  },
  { 
    id: 6, 
    label: 'Damage Close-up', 
    instruction: 'Close-up of any visible damage (if any)',
    tips: [
      'Get within 1-2 feet of damage area',
      'Ensure damage is clearly visible',
      'Take multiple angles if needed'
    ]
  },
  { 
    id: 7, 
    label: 'Additional', 
    instruction: 'Any additional angles or damage areas',
    tips: [
      'Capture any special features or concerns',
      'Document unique vehicle conditions',
      'Include any requested specific areas'
    ]
  },
];

export function PhotoCapture() {
  const navigate = useNavigate();
  const { inspection, updatePhoto } = useInspection();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!inspection.customerInfo) {
      navigate('/driver/inspection/customer-details');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      // Camera not available - silently fall back to upload mode
      setCameraError('Camera not available in this environment. Please use the upload option below.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${currentPhotoIndex + 1}.jpg`, { type: 'image/jpeg' });
        const preview = URL.createObjectURL(blob);

        updatePhoto(currentPhotoIndex, file, preview);
        toast.success(`Photo ${currentPhotoIndex + 1} captured`);

        if (currentPhotoIndex < PHOTO_LABELS.length - 1) {
          setCurrentPhotoIndex(currentPhotoIndex + 1);
        } else {
          navigate('/driver/inspection/review-photos');
        }
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = (index: number) => {
    setCurrentPhotoIndex(index);
    toast.info(`Retaking photo ${index + 1}`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);

    updatePhoto(currentPhotoIndex, file, preview);
    toast.success(`Photo ${currentPhotoIndex + 1} uploaded`);

    // Move to next photo
    if (currentPhotoIndex < PHOTO_LABELS.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      navigate('/driver/inspection/review-photos');
    }

    // Reset input
    event.target.value = '';
  };

  const handleBack = () => {
    if (window.confirm('Are you sure? Unsaved photos will be lost.')) {
      navigate('/driver/inspection/customer-details');
    }
  };

  const goToReview = () => {
    const capturedCount = inspection.photos.filter((p) => p.captured).length;
    if (capturedCount === 0) {
      toast.error('Please capture at least one photo');
      return;
    }
    navigate('/driver/inspection/review-photos');
  };

  const currentPhoto = PHOTO_LABELS[currentPhotoIndex];
  const capturedCount = inspection.photos.filter((p) => p.captured).length;

  return (
    <div className="min-h-screen relative bg-slate-950">
      {/* Dark Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

      {/* Header - Glassmorphism */}
      <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-white">Vehicle Photos</h1>
                <p className="text-xs text-slate-400">Step 2 of 3</p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={goToReview} 
              disabled={capturedCount === 0}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md disabled:opacity-50"
            >
              Review ({capturedCount}/8)
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar - Glassmorphism */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-white mb-2">
            <span>Photo {currentPhotoIndex + 1} of 8</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {capturedCount}/8 captured
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(capturedCount / 8) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Photo Instruction Card - Glassmorphism */}
      <div className="container mx-auto px-4 py-4">
        <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 animate-fade-in-up">
          <div className="flex items-start gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-base">{currentPhoto.label}</h3>
              <p className="text-sm text-slate-400 mt-1">{currentPhoto.instruction}</p>
              <ul className="mt-2 list-disc list-inside text-xs text-slate-400">
                {currentPhoto.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="container mx-auto px-4">
        <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          {cameraError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-white font-medium mb-2">Camera Access Required</p>
                <p className="text-slate-400 text-sm mb-4">{cameraError}</p>
                <Button 
                  onClick={startCamera} 
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Grid Overlay */}
              {gridEnabled && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="33.33" y1="0" x2="33.33" y2="100" stroke="white" strokeWidth="0.2" opacity="0.5" />
                    <line x1="66.66" y1="0" x2="66.66" y2="100" stroke="white" strokeWidth="0.2" opacity="0.5" />
                    <line x1="0" y1="33.33" x2="100" y2="33.33" stroke="white" strokeWidth="0.2" opacity="0.5" />
                    <line x1="0" y1="66.66" x2="100" y2="66.66" stroke="white" strokeWidth="0.2" opacity="0.5" />
                  </svg>
                </div>
              )}

              {/* Camera Controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <Button
                  size="icon"
                  className="bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border border-white/10"
                  onClick={() => setFlashEnabled(!flashEnabled)}
                >
                  {flashEnabled ? <Flashlight className="h-5 w-5" /> : <FlashlightOff className="h-5 w-5" />}
                </Button>
                <Button
                  size="icon"
                  className="bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border border-white/10"
                  onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className={`bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border border-white/10 ${
                    gridEnabled ? 'bg-white/20 border-white/30' : ''
                  }`}
                  onClick={() => setGridEnabled(!gridEnabled)}
                >
                  <Grid3x3 className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Capture Button */}
        {!cameraError && (
          <div className="flex justify-center py-6">
            <button
              onClick={capturePhoto}
              className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 hover:border-white/50 hover:scale-105 transition-all shadow-2xl group cursor-pointer"
            >
              <div className="absolute inset-2 rounded-full bg-white group-hover:bg-slate-100 transition-colors flex items-center justify-center">
                <Camera className="h-8 w-8 text-slate-900" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Photo Thumbnail Strip - Glassmorphism */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {inspection.photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 ${
                index === currentPhotoIndex
                  ? 'border-white/50 shadow-lg shadow-white/20'
                  : photo.captured
                  ? 'border-green-500/50 shadow-lg shadow-green-500/20'
                  : 'border-white/10'
              } relative cursor-pointer transition-all hover:scale-105 bg-white/5 backdrop-blur-md`}
              onClick={() => photo.captured && retakePhoto(index)}
            >
              {photo.captured && photo.preview ? (
                <>
                  <img src={photo.preview} alt={photo.label} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4 text-white" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <span className="text-xs text-slate-400 font-medium">{index + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Capture or Upload Buttons */}
      <div className="container mx-auto px-4 pb-6">
        {/* Large Current Photo Label */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-lg">
              {currentPhotoIndex + 1}
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-300 uppercase tracking-wide">Now Capturing</p>
              <p className="text-xl font-bold text-white">{currentPhoto.label}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {!cameraError && (
            <div className="text-center">
              <button
                onClick={capturePhoto}
                className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 hover:border-white/50 hover:scale-105 transition-all shadow-2xl group cursor-pointer"
              >
                <div className="absolute inset-2 rounded-full bg-white group-hover:bg-slate-100 transition-colors flex items-center justify-center">
                  <Camera className="h-8 w-8 text-slate-900" />
                </div>
              </button>
              <p className="text-xs text-slate-400 mt-2">Capture</p>
            </div>
          )}
          
          <div className="text-center">
            <label
              htmlFor="upload-photo"
              className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 hover:border-white/50 hover:scale-105 transition-all shadow-2xl group cursor-pointer block"
            >
              <div className="absolute inset-2 rounded-full bg-white group-hover:bg-slate-100 transition-colors flex items-center justify-center">
                <Upload className="h-8 w-8 text-slate-900" />
              </div>
              <input
                type="file"
                id="upload-photo"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <p className="text-xs text-slate-400 mt-2">Upload</p>
          </div>
        </div>
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}