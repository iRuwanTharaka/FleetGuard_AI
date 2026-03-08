import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { mockVehicles } from '@/data/mockData';
import { Vehicle, VehicleStatus } from '@/types';
import { 
  Search, 
  MapPin, 
  Calendar,
  Eye,
  Settings,
  Grid3x3,
  List,
  TrendingUp
} from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { motion } from 'motion/react';

// Animated Counter Component
function AnimatedHealthScore({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / 800, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <>{count}</>;
}

export function FleetStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case 'available':
        return 'bg-[#2e7d32] dark:bg-[#4caf50] text-white';
      case 'in-use':
        return 'bg-[#0097a7] dark:bg-[#00bcd4] text-white';
      case 'needs-repair':
        return 'bg-[#f97316] dark:bg-[#fb923c] text-white';
      case 'critical':
        return 'bg-[#dc2626] dark:bg-[#ef4444] text-white';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#2e7d32] dark:text-[#4caf50]';
    if (score >= 75) return 'text-[#2196f3] dark:text-[#42a5f5]';
    if (score >= 60) return 'text-[#fbbf24] dark:text-[#fcd34d]';
    return 'text-[#dc2626] dark:text-[#ef4444]';
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1612862862126-865765df2ded?w=1200)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/95 via-[#0a1929]/80 to-transparent dark:from-[#0a1929]/95 dark:via-[#0a1929]/80" />
        <div className="relative z-10 h-full flex items-center p-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2196f3]/20 to-[#2e7d32]/20 border border-[#2196f3]/30 rounded-full px-4 py-2 mb-3 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 text-[#4caf50]" />
              <span className="text-sm text-[#90caf9] dark:text-[#90caf9] font-medium">Real-Time Monitoring</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Fleet Status</h1>
            <p className="text-lg text-[#bbdefb]">Monitor and manage your entire vehicle fleet across Sri Lanka</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle number, make, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as VehicleStatus | 'all')}>
              <SelectTrigger className="w-full lg:w-[200px] bg-input-background border-border text-foreground">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in-use">In Use</SelectItem>
                <SelectItem value="needs-repair">Needs Repair</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[200px] bg-input-background border-border text-foreground">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="tuk-tuk">Tuk-Tuk</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gradient-to-r from-[#2196f3] to-[#0097a7]' : ''}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-gradient-to-r from-[#2196f3] to-[#0097a7]' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of{' '}
          <span className="font-semibold text-foreground">{mockVehicles.length}</span> vehicles
        </p>
      </div>

      {/* Vehicle Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all bg-card border-border group">
                <div className="relative">
                  <img 
                    src={vehicle.imageUrl} 
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Badge 
                    className={`absolute top-3 right-3 ${getStatusColor(vehicle.status)} shadow-lg`}
                  >
                    {vehicle.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-foreground">{vehicle.number}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                  </div>

                  {/* Health Score with Animation */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Health Score</span>
                      <span className={`text-sm font-bold ${getHealthScoreColor(vehicle.healthScore)}`}>
                        <AnimatedHealthScore value={vehicle.healthScore} />/100
                      </span>
                    </div>
                    <Progress 
                      value={vehicle.healthScore} 
                      className="h-2"
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Last inspection: {new Date(vehicle.lastInspection).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{vehicle.location?.address}</span>
                    </div>
                    {vehicle.currentAssignment && (
                      <div className="p-2 bg-[#0097a7]/10 dark:bg-[#0097a7]/20 rounded text-xs">
                        <p className="font-semibold text-[#0097a7] dark:text-[#00bcd4]">Rented to: {vehicle.currentAssignment.customerName}</p>
                        <p className="text-muted-foreground">Return: {new Date(vehicle.currentAssignment.returnDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-border text-foreground hover:bg-muted"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                    {vehicle.status === 'available' && (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-[#2196f3] to-[#0097a7] hover:from-[#1976d2] hover:to-[#00796b] text-white"
                      >
                        Assign
                      </Button>
                    )}
                    {(vehicle.status === 'needs-repair' || vehicle.status === 'critical') && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-muted"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Service
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-all bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={vehicle.imageUrl} 
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{vehicle.number}</h3>
                          <p className="text-sm text-muted-foreground">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                        </div>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {vehicle.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Health Score</p>
                          <div className="flex items-center gap-2">
                            <Progress value={vehicle.healthScore} className="h-2 flex-1" />
                            <span className={`text-sm font-bold ${getHealthScoreColor(vehicle.healthScore)}`}>
                              <AnimatedHealthScore value={vehicle.healthScore} />
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Location</p>
                          <p className="text-sm font-medium text-foreground">{vehicle.location?.address}</p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Last Inspection</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(vehicle.lastInspection).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {vehicle.currentAssignment && (
                        <div className="mt-2 p-2 bg-[#0097a7]/10 dark:bg-[#0097a7]/20 rounded-lg">
                          <p className="text-xs font-semibold text-[#0097a7] dark:text-[#00bcd4]">
                            Rented to: {vehicle.currentAssignment.customerName} • Return: {new Date(vehicle.currentAssignment.returnDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {vehicle.status === 'available' && (
                        <Button size="sm" className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] hover:from-[#1b5e20] hover:to-[#2e7d32] text-white">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No vehicles found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
