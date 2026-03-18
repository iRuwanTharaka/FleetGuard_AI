/**
 * @module     Client Portal (Driver-Facing Interface)
 * @author     Yuraj Malinda <yurajmalinda123@gmail.com>
 * @description This file is part of the Client (Driver) Portal of FleetGuard AI.
 *              All pages and components in this section were developed by Yuraj Malinda.
 * @date       2026-03-07
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Dialog, DialogContent, DialogTitle } from '@/app/components/ui/dialog';
import { ArrowLeft, RotateCcw, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { inspectionService } from '@/services/inspectionService';

// Map frontend labels to backend photo_type (matches AI service order)
const LABEL_TO_TYPE: Record<string, string> = {
  'Front View': 'front',
  'Rear View': 'rear',
  'Left Side': 'left',
  'Right Side': 'right',
  'Interior': 'interior',
  'Dashboard/Odometer': 'dashboard',
  'Damage Close-up': 'damage',
  'Additional': 'odometer',
};

export function PhotoReview() {
  const navigate = useNavigate();
  const { inspection, currentInspectionId } = useInspection();
  const [allPhotosApproved, setAllPhotosApproved] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const capturedPhotos = inspection.photos.filter((p) => p.captured);

  const handleRetake = (index: number) => {
    navigate('/driver/inspection/photos');
  };

  const handleBack = () => {
    navigate('/driver/inspection/photos');
  };

  const handleUpload = async () => {
    if (!allPhotosApproved) {
      toast.error('Please confirm all photos are clear and accurate');
      return;
    }

    if (capturedPhotos.length < 8) {
      toast.error('All 8 photos are required for AI analysis');
      return;
    }

    if (!currentInspectionId) {
      toast.error('Inspection not found. Please start over.');
      navigate('/driver/inspection/customer-details');
      return;
    }

    setIsUploading(true);
    toast.info('Uploading photos...');

    try {
      const files = capturedPhotos.map((p) => p.file).filter((f): f is File => !!f);
      const types = capturedPhotos.map((p) => LABEL_TO_TYPE[p.label] || 'damage');
      await inspectionService.uploadBatch(currentInspectionId, files, types);
      toast.success('Photos uploaded successfully');
      navigate('/driver/inspection/processing');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  if (capturedPhotos.length === 0) {
    navigate('/driver/inspection/photos');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Review Photos</h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {capturedPhotos.length}/8 photos
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex-1 text-center">
              <div className="w-8 h-8 rounded-full bg-[#4caf50] text-white flex items-center justify-center mx-auto mb-1 font-semibold">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-[#4caf50] font-medium">Customer</p>
            </div>
            <div className="flex-1 border-t-2 border-[#2196f3] mx-2 mt-[-20px]"></div>
            <div className="flex-1 text-center">
              <div className="w-8 h-8 rounded-full bg-[#2196f3] text-white flex items-center justify-center mx-auto mb-1 font-semibold">
                2
              </div>
              <p className="text-[#2196f3] font-medium">Photos</p>
            </div>
            <div className="flex-1 border-t-2 border-gray-300 dark:border-gray-600 mx-2 mt-[-20px]"></div>
            <div className="flex-1 text-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 flex items-center justify-center mx-auto mb-1 font-semibold">
                3
              </div>
              <p className="text-gray-500 dark:text-gray-400">Report</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {inspection.photos.map((photo, index) => (
            <Card
              key={photo.id}
              className={`relative overflow-hidden ${
                photo.captured ? 'cursor-pointer hover:shadow-lg transition-shadow' : 'opacity-50'
              }`}
              onClick={() => photo.captured && photo.preview && setSelectedPhoto(photo.preview)}
            >
              <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700">
                {photo.captured && photo.preview ? (
                  <>
                    <img src={photo.preview} alt={photo.label} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#4caf50] rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{photo.label}</p>
                {photo.captured ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-[#2196f3] hover:text-[#1976d2] hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRetake(index);
                    }}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Retake
                  </Button>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">Not captured</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Approval Checkbox */}
        <Card className="p-4 bg-white dark:bg-gray-800">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="approve"
              checked={allPhotosApproved}
              onCheckedChange={(checked) => setAllPhotosApproved(checked as boolean)}
            />
            <label
              htmlFor="approve"
              className="text-sm text-gray-900 dark:text-white leading-relaxed cursor-pointer flex-1"
            >
              All photos are clear and accurate. I confirm these images properly represent the vehicle condition.
            </label>
          </div>
        </Card>

        {/* Info Card */}
        {capturedPhotos.length < 8 && (
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-lg p-2">
                <ImageIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  All 8 photos required for AI analysis
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  You have {capturedPhotos.length} photo{capturedPhotos.length !== 1 ? 's' : ''}. Please capture
                  {8 - capturedPhotos.length > 0 ? ` ${8 - capturedPhotos.length} more` : ''}.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 md:relative md:border-0 md:p-0">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleBack}>
              Back to Camera
            </Button>
            <Button
              className="flex-1 bg-[#2196f3] hover:bg-[#1976d2] text-white"
              onClick={handleUpload}
              disabled={!allPhotosApproved || capturedPhotos.length < 8 || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload & Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle className="sr-only">Photo Preview</DialogTitle>
          {selectedPhoto && (
            <div className="relative">
              <img src={selectedPhoto} alt="Photo preview" className="w-full h-auto rounded-lg" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
