import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { mockDamageReports } from '@/data/mockData';
import { AlertTriangle, Eye, DollarSign, X, Camera, MapPin, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// Animated Counter Component
function AnimatedCounter({ value, duration = 800 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count}</>;
}

// Damage Photo Viewer with AI Detection Overlay
interface DamageViewerProps {
  imageUrl: string;
  vehicleNumber: string;
  damageLocation: string;
  aiConfidence: number;
  onClose: () => void;
}

function DamagePhotoViewer({ imageUrl, vehicleNumber, damageLocation, aiConfidence, onClose }: DamageViewerProps) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-5xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-[#4caf50] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image Container with AI Detection Overlay */}
          <div className="relative bg-card rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={imageUrl}
              alt={vehicleNumber}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            
            {/* AI Detection Overlays */}
            {damageLocation === 'Front Bumper' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-[35%] left-[20%] w-32 h-24"
              >
                {/* Detection Box */}
                <div className="absolute inset-0 border-4 border-[#dc2626] rounded-lg animate-pulse" />
                <div className="absolute inset-0 bg-[#dc2626]/20 rounded-lg" />
                
                {/* Label */}
                <div className="absolute -top-8 left-0 bg-[#dc2626] text-white px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                  Damage Detected
                </div>
                
                {/* Confidence Score */}
                <div className="absolute -bottom-8 left-0 bg-[#0a1929] text-white px-3 py-1 rounded-md text-xs">
                  AI: {aiConfidence}% confidence
                </div>
              </motion.div>
            )}

            {damageLocation === 'Rear Left Door' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-[40%] right-[25%] w-28 h-32"
              >
                <div className="absolute inset-0 border-4 border-[#fbbf24] rounded-lg animate-pulse" />
                <div className="absolute inset-0 bg-[#fbbf24]/20 rounded-lg" />
                <div className="absolute -top-8 right-0 bg-[#fbbf24] text-white px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                  Scratch Detected
                </div>
                <div className="absolute -bottom-8 right-0 bg-[#0a1929] text-white px-3 py-1 rounded-md text-xs">
                  AI: {aiConfidence}% match
                </div>
              </motion.div>
            )}

            {damageLocation === 'Front Right Headlight' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-[30%] right-[30%] w-20 h-20"
              >
                <div className="absolute inset-0 border-4 border-[#dc2626] rounded-lg animate-pulse" />
                <div className="absolute inset-0 bg-[#dc2626]/20 rounded-lg" />
                <div className="absolute -top-8 right-0 bg-[#dc2626] text-white px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                  Broken Light
                </div>
                <div className="absolute -bottom-8 right-0 bg-[#0a1929] text-white px-3 py-1 rounded-md text-xs">
                  AI: {aiConfidence}%
                </div>
              </motion.div>
            )}

            {/* Info Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1929]/95 to-transparent p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-2">{vehicleNumber}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#4caf50]" />
                    <span>AI Analysis Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2196f3]" />
                    <span>{damageLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-white text-center mt-4 text-sm">
            Click anywhere outside to close • Red boxes indicate AI-detected damage
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function DamageReports() {
  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string;
    vehicleNumber: string;
    damageLocation: string;
    aiConfidence: number;
  } | null>(null);

  const totalDamages = mockDamageReports.length;
  const avgRepairCost = Math.round(
    mockDamageReports.reduce((sum, r) => sum + (r.damage.estimatedCost || 0), 0) / totalDamages
  );

  const damageTypeData = [
    { name: 'Scratches', value: 1, color: '#2196f3' },
    { name: 'Dents', value: 1, color: '#fbbf24' },
    { name: 'Broken Lights', value: 1, color: '#dc2626' },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'severe':
        return <Badge className="bg-[#dc2626] dark:bg-[#ef4444] text-white">Severe</Badge>;
      case 'moderate':
        return <Badge className="bg-[#fbbf24] dark:bg-[#fcd34d] text-white">Moderate</Badge>;
      case 'minor':
        return <Badge className="bg-[#2e7d32] dark:bg-[#4caf50] text-white">Minor</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-[#fbbf24] dark:border-[#fcd34d] text-[#fbbf24] dark:text-[#fcd34d]">Pending</Badge>;
      case 'repaired':
        return <Badge className="bg-[#2e7d32] dark:bg-[#4caf50] text-white">Repaired</Badge>;
      case 'insurance-claimed':
        return <Badge className="bg-[#2196f3] dark:bg-[#42a5f5] text-white">Insurance Claimed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Sri Lankan Imagery */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden h-48 shadow-xl"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1721992499083-637b6ee0c7ba?w=1200)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/95 via-[#0a1929]/80 to-transparent dark:from-[#0a1929]/95 dark:via-[#0a1929]/80" />
        <div className="relative z-10 h-full flex items-center p-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#dc2626]/20 to-[#2196f3]/20 border border-[#dc2626]/30 rounded-full px-4 py-2 mb-3 backdrop-blur-sm">
              <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
              <span className="text-sm text-[#90caf9] dark:text-[#90caf9] font-medium">AI Damage Detection Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Damage Reports</h1>
            <p className="text-lg text-[#bbdefb]">Track and manage vehicle damage incidents with AI-powered analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Stats & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-[#dc2626] bg-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Damages This Month</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    <AnimatedCounter value={totalDamages} />
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#dc2626]/20 to-[#ef4444]/20 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-[#dc2626]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-[#2196f3] bg-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Repair Cost</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    Rs. <AnimatedCounter value={avgRepairCost} />
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2196f3]/20 to-[#42a5f5]/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-[#2196f3]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Damage by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={damageTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {damageTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Damage Reports List */}
      <div className="space-y-4">
        {mockDamageReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="hover:shadow-xl transition-all bg-card border-border group">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Vehicle Image with Click to View */}
                  <div 
                    className="w-full lg:w-48 h-48 flex-shrink-0 relative cursor-pointer group/image"
                    onClick={() => setSelectedImage({
                      imageUrl: report.vehicleImageUrl,
                      vehicleNumber: report.vehicleNumber,
                      damageLocation: report.damage.location,
                      aiConfidence: report.damage.aiConfidence
                    })}
                  >
                    <img 
                      src={report.vehicleImageUrl} 
                      alt={report.vehicleNumber}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover/image:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/80 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white text-sm font-semibold">View AI Analysis</p>
                      </div>
                    </div>
                  </div>

                  {/* Damage Details */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{report.vehicleNumber}</h3>
                        <p className="text-sm text-muted-foreground">{report.vehicleType}</p>
                      </div>
                      <div className="flex gap-2">
                        {getSeverityBadge(report.damage.severity)}
                        {getStatusBadge(report.status)}
                      </div>
                    </div>

                    {/* Damage Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Damage Type</p>
                        <p className="font-semibold text-sm capitalize text-foreground">{report.damage.type.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                        <p className="font-semibold text-sm text-foreground">{report.damage.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">AI Confidence</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${report.damage.aiConfidence}%` }}
                              transition={{ delay: 0.3, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-[#2196f3] to-[#0097a7]" 
                            />
                          </div>
                          <span className="text-sm font-bold text-foreground">{report.damage.aiConfidence}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Estimated Cost</p>
                        <p className="font-semibold text-sm text-[#dc2626] dark:text-[#ef4444]">
                          Rs. {report.damage.estimatedCost?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm text-foreground">{report.damage.description}</p>
                    </div>

                    {/* Customer & Date */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        {report.customerInvolved && (
                          <p className="text-sm text-foreground">
                            <span className="text-muted-foreground">Customer: </span>
                            <span className="font-semibold">{report.customerInvolved}</span>
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Detected on {new Date(report.dateDetected).toLocaleDateString()} at{' '}
                          {new Date(report.dateDetected).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button 
                        variant="outline"
                        className="border-border text-foreground hover:bg-muted"
                        onClick={() => setSelectedImage({
                          imageUrl: report.vehicleImageUrl,
                          vehicleNumber: report.vehicleNumber,
                          damageLocation: report.damage.location,
                          aiConfidence: report.damage.aiConfidence
                        })}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View AI Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Damage Photo Viewer Modal */}
      {selectedImage && (
        <DamagePhotoViewer
          imageUrl={selectedImage.imageUrl}
          vehicleNumber={selectedImage.vehicleNumber}
          damageLocation={selectedImage.damageLocation}
          aiConfidence={selectedImage.aiConfidence}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
