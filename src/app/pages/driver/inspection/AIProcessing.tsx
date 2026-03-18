/**
 * @module     Client Portal (Driver-Facing Interface)
 * @author     Yuraj Malinda <yurajmalinda123@gmail.com>
 * @description This file is part of the Client (Driver) Portal of FleetGuard AI.
 *              All pages and components in this section were developed by Yuraj Malinda.
 * @date       2026-03-08
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import { Progress } from '@/app/components/ui/progress';
import { Loader2, Brain, ScanLine, Calculator, FileText } from 'lucide-react';
import { inspectionService } from '@/services/inspectionService';
import type { DamageDetection, AnnotatedImage } from '@/contexts/InspectionContext';

const PROCESSING_STEPS = [
  { icon: FileText, message: 'Uploading photos...', duration: 15 },
  { icon: ScanLine, message: 'Analyzing damage...', duration: 40 },
  { icon: Calculator, message: 'Calculating health score...', duration: 25 },
  { icon: Brain, message: 'Generating report...', duration: 20 },
];

// Map backend photo_type → frontend photo id (1-8)
const PHOTO_TYPE_TO_ID: Record<string, string> = {
  front: '1',
  rear: '2',
  left: '3',
  right: '4',
  interior: '5',
  dashboard: '6',
  damage: '7',
  odometer: '8',
};

const severityMap: Record<string, 'minor' | 'moderate' | 'major'> = {
  low: 'minor',
  medium: 'moderate',
  high: 'major',
};

export function AIProcessing() {
  const navigate = useNavigate();
  const { inspection, setDamages, setHealthScore, setAnnotatedImages, currentInspectionId } = useInspection();
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const capturedPhotos = inspection.photos.filter((p) => p.captured);
    if (capturedPhotos.length === 0) {
      navigate('/driver/inspection/photos');
      return;
    }
    if (!currentInspectionId) {
      navigate('/driver/inspection/customer-details');
      return;
    }
    startProcessing();
  }, []);

  const startProcessing = async () => {
    try {
      // Run AI analysis in parallel with progress animation
      const analyzePromise = inspectionService.analyzeWithAI(currentInspectionId);

      // Animate progress while waiting
      let totalProgress = 0;
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setCurrentStepIndex(i);
        const step = PROCESSING_STEPS[i];
        const stepDuration = step.duration;
        const incrementPerTick = stepDuration / 20;

        for (let tick = 0; tick < 20; tick++) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          totalProgress += incrementPerTick;
          setProgress(Math.min(totalProgress, 100));
        }
      }

      const data = await analyzePromise;
      const backendDamages = data.damages || [];
      const mappedDamages: DamageDetection[] = backendDamages.map(
        (
          d: {
            type?: string;
            severity?: string;
            confidence?: number;
            location?: string;
            photo_type?: string;
          },
          idx: number
        ) => ({
          id: String(idx + 1),
          type: d.type || 'scratch',
          severity: (severityMap[d.severity as string] || d.severity || 'minor') as 'minor' | 'moderate' | 'major',
          location: d.location || 'Unknown',
          confidence: typeof d.confidence === 'number' ? d.confidence : 0,
          photoId: PHOTO_TYPE_TO_ID[d.photo_type as string] || String((d as { photo_index?: number }).photo_index != null ? (d as { photo_index: number }).photo_index + 1 : '1'),
        })
      );
      setDamages(mappedDamages);
      setHealthScore(data.health_score ?? 100);

      const annotated = (data.annotated_images || []).map(
        (a: { photo_index?: number; photo_label?: string; image_b64?: string; damage_count?: number }) =>
          ({
            photo_index: a.photo_index ?? 0,
            photo_label: a.photo_label || '',
            image_b64: a.image_b64 || '',
            damage_count: a.damage_count ?? 0,
          }) as AnnotatedImage
      );
      setAnnotatedImages(annotated);

      setIsProcessing(false);
      setTimeout(() => navigate('/driver/inspection/results'), 500);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err && typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
          ? (err as { response: { data: { error: string } } }).response.data.error
          : 'Analysis failed. Please retry.';
      setError(msg);
      setIsProcessing(false);
      setTimeout(() => navigate('/driver/inspection/results'), 2000);
    }
  };

  const currentStep = PROCESSING_STEPS[currentStepIndex];
  const CurrentIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d47a1] via-[#1976d2] to-[#2196f3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Processing Photos</h1>
          <p className="text-blue-100">AI is analyzing your vehicle inspection</p>
        </div>

        {/* Animated Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-white/30 border-r-white/30"></div>
            </div>
            
            {/* Inner pulsing circle */}
            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="animate-pulse">
                <CurrentIcon className="h-16 w-16 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-center mb-4">
              <p className="text-white font-medium text-lg">{currentStep.message}</p>
              <p className="text-blue-100 text-2xl font-bold mt-2">{Math.round(progress)}%</p>
            </div>
            
            <Progress value={progress} className="h-3 bg-white/20" />
          </div>

          {/* Processing Steps */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
            {PROCESSING_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;
              
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 transition-opacity ${
                    isActive || isComplete ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isComplete
                        ? 'bg-[#4caf50]'
                        : isActive
                        ? 'bg-white animate-pulse'
                        : 'bg-white/20'
                    }`}
                  >
                    {isComplete ? (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <StepIcon className={`h-4 w-4 ${isActive ? 'text-[#1976d2]' : 'text-white'}`} />
                    )}
                  </div>
                  <span className="text-white text-sm">{step.message}</span>
                  {isActive && <Loader2 className="h-4 w-4 text-white animate-spin ml-auto" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-100 text-sm text-center">
            {error || <><strong>Please wait</strong> - Do not close this page while processing</>}
          </p>
        </div>

        {/* Estimated Time */}
        <div className="text-center mt-6">
          <p className="text-blue-100 text-sm">
            Estimated time remaining: {Math.max(0, Math.round((100 - progress) / 3))} seconds
          </p>
        </div>
      </div>
    </div>
  );
}
