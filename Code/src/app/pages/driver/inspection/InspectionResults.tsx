import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Dialog, DialogContent, DialogTitle } from '@/app/components/ui/dialog';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ArrowRight,
  RotateCcw,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';

export function InspectionResults() {
  const navigate = useNavigate();
  const { inspection } = useInspection();
  const [expandedDamage, setExpandedDamage] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<{ preview: string; damages: any[] } | null>(null);

  const handleContinue = () => {
    navigate('/driver/inspection/signatures');
  };

  const handleRetake = () => {
    if (window.confirm('This will discard current analysis. Continue?')) {
      navigate('/driver/inspection/photos');
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-[#4caf50]', text: 'text-[#4caf50]', label: 'Excellent' };
    if (score >= 60) return { bg: 'bg-[#fbbf24]', text: 'text-[#fbbf24]', label: 'Good' };
    return { bg: 'bg-[#dc2626]', text: 'text-[#dc2626]', label: 'Poor' };
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      minor: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
      moderate: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
      major: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
    };
    const variant = variants[severity] || variants.minor;
    return (
      <Badge className={`${variant.bg} ${variant.text} border-0`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const getDamageIcon = (type: string) => {
    return '⚠️';
  };

  const healthScore = inspection.healthScore || 0;
  const scoreData = getHealthScoreColor(healthScore);
  const severityCounts = {
    minor: inspection.damages.filter((d) => d.severity === 'minor').length,
    moderate: inspection.damages.filter((d) => d.severity === 'moderate').length,
    major: inspection.damages.filter((d) => d.severity === 'major').length,
  };

  const photosWithDamages = inspection.photos
    .filter((p) => p.captured)
    .map((photo) => ({
      ...photo,
      damages: inspection.damages.filter((d) => d.photoId === photo.id),
    }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Inspection Results</h1>
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
            <div className="flex-1 border-t-2 border-[#4caf50] mx-2 mt-[-20px]"></div>
            <div className="flex-1 text-center">
              <div className="w-8 h-8 rounded-full bg-[#4caf50] text-white flex items-center justify-center mx-auto mb-1 font-semibold">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-[#4caf50] font-medium">Photos</p>
            </div>
            <div className="flex-1 border-t-2 border-[#2196f3] mx-2 mt-[-20px]"></div>
            <div className="flex-1 text-center">
              <div className="w-8 h-8 rounded-full bg-[#2196f3] text-white flex items-center justify-center mx-auto mb-1 font-semibold">
                3
              </div>
              <p className="text-[#2196f3] font-medium">Report</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Vehicle Summary */}
        <Card className="p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{inspection.vehicleNumber}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {inspection.vehicleMake} {inspection.vehicleModel} ({inspection.vehicleYear})
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
            <p className="flex items-center">
              <span className="font-medium mr-1">Inspected:</span>
              {format(new Date(), 'PPp')}
            </p>
            <p className="flex items-center">
              <span className="font-medium mr-1">Customer:</span>
              {inspection.customerInfo?.name}
            </p>
          </div>
        </Card>

        {/* Health Score */}
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Vehicle Health Score</p>
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className={scoreData.text}
                  strokeDasharray={`${(healthScore / 100) * 440} 440`}
                  transform="rotate(-90 80 80)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${scoreData.text}`}>{healthScore}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">/ 100</span>
              </div>
            </div>
            <Badge className={`${scoreData.bg} text-white text-base px-4 py-1`}>{scoreData.label}</Badge>
          </div>
        </Card>

        {/* Damage Summary */}
        <Card className="p-4 bg-white dark:bg-gray-800">
          <div className="flex items-start space-x-3 mb-4">
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Damage Summary</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {inspection.damages.length} {inspection.damages.length === 1 ? 'damage' : 'damages'} detected
              </p>
            </div>
          </div>
          
          {inspection.damages.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {severityCounts.minor > 0 && (
                <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                  {severityCounts.minor} Minor
                </Badge>
              )}
              {severityCounts.moderate > 0 && (
                <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                  {severityCounts.moderate} Moderate
                </Badge>
              )}
              {severityCounts.major > 0 && (
                <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                  {severityCounts.major} Major
                </Badge>
              )}
            </div>
          )}
        </Card>

        {/* Photos with AI Highlights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">AI Analysis Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photosWithDamages.map((photo) => (
              <Card
                key={photo.id}
                className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 relative">
                  {photo.preview && <img src={photo.preview} alt={photo.label} className="w-full h-full object-cover" />}
                  {photo.damages.length > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {photo.damages.length}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{photo.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Damage List */}
        {inspection.damages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Detailed Damage Report</h3>
            <div className="space-y-3">
              {inspection.damages.map((damage) => {
                const isExpanded = expandedDamage === damage.id;
                const photo = inspection.photos.find((p) => p.id === damage.photoId);
                
                return (
                  <Card key={damage.id} className="overflow-hidden bg-white dark:bg-gray-800">
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => setExpandedDamage(isExpanded ? null : damage.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-2xl">{getDamageIcon(damage.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                {damage.type.replace('-', ' ')}
                              </p>
                              {getSeverityBadge(damage.severity)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {damage.location}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              AI Confidence: <span className="font-medium">{damage.confidence}%</span>
                            </p>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                        {photo?.preview && (
                          <div className="mb-3">
                            <img
                              src={photo.preview}
                              alt="Damage detail"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Photo:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{photo?.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Severity:</span>
                            <span className="font-medium text-gray-900 dark:text-white capitalize">{damage.severity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Detection Confidence:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{damage.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 md:relative md:border-0 md:p-0">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleRetake}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Photos
            </Button>
            <Button className="flex-1 bg-[#2196f3] hover:bg-[#1976d2] text-white" onClick={handleContinue}>
              Continue to Signatures
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle className="text-lg font-semibold mb-4">
            {selectedPhoto?.label}
            {selectedPhoto && selectedPhoto.damages.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {selectedPhoto.damages.length} {selectedPhoto.damages.length === 1 ? 'damage' : 'damages'}
              </Badge>
            )}
          </DialogTitle>
          {selectedPhoto?.preview && (
            <div className="relative">
              <img src={selectedPhoto.preview} alt="Photo preview" className="w-full h-auto rounded-lg" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
