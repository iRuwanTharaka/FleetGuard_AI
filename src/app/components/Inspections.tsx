import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { mockInspections } from '@/data/mockData';
import { 
  Search, 
  Download,
  Eye,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Camera
} from 'lucide-react';
import { motion } from 'motion/react';

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

export function Inspections() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInspections = mockInspections.filter(inspection =>
    inspection.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inspection.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inspection.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalInspections = mockInspections.length;
  const damagesDetected = mockInspections.filter(i => i.damagesFound > 0).length;
  const avgConditionScore = Math.round(
    mockInspections.reduce((sum, i) => sum + i.conditionScore, 0) / mockInspections.length
  );
  const disputedClaims = mockInspections.filter(i => i.status === 'disputed').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-[#2e7d32] dark:bg-[#4caf50] text-white">Complete</Badge>;
      case 'pending':
        return <Badge className="bg-[#fbbf24] dark:bg-[#fcd34d] text-white">Pending</Badge>;
      case 'disputed':
        return <Badge className="bg-[#dc2626] dark:bg-[#ef4444] text-white">Disputed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'check-out' ? (
      <Badge variant="outline" className="border-[#2e7d32] dark:border-[#4caf50] text-[#2e7d32] dark:text-[#4caf50]">
        <TrendingUp className="w-3 h-3 mr-1" />
        Check-out
      </Badge>
    ) : (
      <Badge variant="outline" className="border-[#2196f3] dark:border-[#42a5f5] text-[#2196f3] dark:text-[#42a5f5]">
        <TrendingDown className="w-3 h-3 mr-1" />
        Check-in
      </Badge>
    );
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1705730576482-407df8ee3017?w=1200)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/95 via-[#0a1929]/80 to-transparent dark:from-[#0a1929]/95 dark:via-[#0a1929]/80" />
        <div className="relative z-10 h-full flex items-center p-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2196f3]/20 to-[#2e7d32]/20 border border-[#2196f3]/30 rounded-full px-4 py-2 mb-3 backdrop-blur-sm">
              <Camera className="w-4 h-4 text-[#4caf50]" />
              <span className="text-sm text-[#90caf9] dark:text-[#90caf9] font-medium">AI-Powered Inspections</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Inspection Reports</h1>
            <p className="text-lg text-[#bbdefb]">View and manage all vehicle inspection records with AI damage detection</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-[#2196f3] bg-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Inspections</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    <AnimatedCounter value={totalInspections} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2196f3]/20 to-[#42a5f5]/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#2196f3]" />
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
          <Card className="border-l-4 border-l-[#dc2626] bg-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Damages Detected</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    <AnimatedCounter value={damagesDetected} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#dc2626]/20 to-[#ef4444]/20 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-[#dc2626]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-[#2e7d32] bg-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Condition Score</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    <AnimatedCounter value={avgConditionScore} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2e7d32]/20 to-[#4caf50]/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#2e7d32]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-[#fbbf24] bg-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disputed Claims</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    <AnimatedCounter value={disputedClaims} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fbbf24]/20 to-[#fcd34d]/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#fbbf24]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle, customer, or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              <Download className="w-4 h-4 mr-2" />
              Export to PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inspections Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 dark:bg-muted/20 hover:bg-muted/50 dark:hover:bg-muted/20">
                  <TableHead className="text-foreground">Date & Time</TableHead>
                  <TableHead className="text-foreground">Vehicle</TableHead>
                  <TableHead className="text-foreground">Driver</TableHead>
                  <TableHead className="text-foreground">Customer</TableHead>
                  <TableHead className="text-foreground">Type</TableHead>
                  <TableHead className="text-foreground">Condition Score</TableHead>
                  <TableHead className="text-foreground">Damages</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.map((inspection) => (
                  <TableRow key={inspection.id} className="hover:bg-muted/50 dark:hover:bg-muted/20 border-border">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {new Date(inspection.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(inspection.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{inspection.vehicleNumber}</p>
                        <p className="text-xs text-muted-foreground">{inspection.vehicleName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{inspection.driverName}</TableCell>
                    <TableCell className="text-sm text-foreground">{inspection.customerName}</TableCell>
                    <TableCell>{getTypeBadge(inspection.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          inspection.conditionScore >= 90 ? 'text-[#2e7d32] dark:text-[#4caf50]' :
                          inspection.conditionScore >= 75 ? 'text-[#2196f3] dark:text-[#42a5f5]' :
                          inspection.conditionScore >= 60 ? 'text-[#fbbf24] dark:text-[#fcd34d]' :
                          'text-[#dc2626] dark:text-[#ef4444]'
                        }`}>
                          {inspection.conditionScore}
                        </span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {inspection.damagesFound > 0 ? (
                        <Badge variant="outline" className="border-[#dc2626] dark:border-[#ef4444] text-[#dc2626] dark:text-[#ef4444]">
                          {inspection.damagesFound} found
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-[#2e7d32] dark:border-[#4caf50] text-[#2e7d32] dark:text-[#4caf50]">
                          None
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-muted">
                          <Eye className="w-4 h-4 text-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-muted">
                          <Download className="w-4 h-4 text-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredInspections.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No inspections found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
