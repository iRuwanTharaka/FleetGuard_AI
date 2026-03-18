import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { 
  Car, 
  CheckCircle2, 
  Wrench, 
  AlertTriangle,
  TrendingUp,
  Clock,
  ClipboardList,
  MapPin
} from 'lucide-react';
import { mockVehicles, mockActivities, mockMaintenancePredictions, mockDamageReports, mockInspections } from '@/data/mockData';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

// Animated Counter Component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
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

export function Dashboard() {
  // Calculate stats
  const totalVehicles = mockVehicles.length;
  const availableVehicles = mockVehicles.filter(v => v.status === 'available').length;
  const inUseVehicles = mockVehicles.filter(v => v.status === 'in-use').length;
  const needsRepairVehicles = mockVehicles.filter(v => v.status === 'needs-repair' || v.status === 'critical').length;

  // Fleet health distribution
  const excellentCondition = mockVehicles.filter(v => v.healthScore >= 90).length;
  const goodCondition = mockVehicles.filter(v => v.healthScore >= 75 && v.healthScore < 90).length;
  const fairCondition = mockVehicles.filter(v => v.healthScore >= 60 && v.healthScore < 75).length;
  const needsAttention = mockVehicles.filter(v => v.healthScore < 60).length;

  const fleetHealthData = [
    { name: 'Excellent', value: excellentCondition, color: '#2e7d32' },
    { name: 'Good', value: goodCondition, color: '#4caf50' },
    { name: 'Fair', value: fairCondition, color: '#fbbf24' },
    { name: 'Needs Attention', value: needsAttention, color: '#dc2626' },
  ];

  const damageByTypeData = [
    { type: 'Scratches', count: 12 },
    { type: 'Dents', count: 5 },
    { type: 'Broken Lights', count: 3 },
    { type: 'Other', count: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner with Sri Lankan Imagery */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden h-64 shadow-xl"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544015759-237f87d55ef3?w=1200)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/95 via-[#0a1929]/80 to-transparent dark:from-[#0a1929]/95 dark:via-[#0a1929]/80" />
        <div className="relative z-10 h-full flex items-center p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2196f3]/20 to-[#2e7d32]/20 border border-[#2196f3]/30 rounded-full px-4 py-2 mb-4 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 text-[#4caf50]" />
              <span className="text-sm text-[#90caf9] dark:text-[#90caf9] font-medium">Fleet Health: Excellent</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Welcome Back, Pradeep!
            </h1>
            <p className="text-xl text-[#bbdefb]">
              Your fleet is performing at 90% health. {availableVehicles} vehicles ready for rental today.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-[#1565c0] hover:shadow-lg transition-all bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fleet</p>
                  <p className="text-3xl font-bold mt-1 text-foreground">
                    <AnimatedCounter value={totalVehicles} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">vehicles</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2196f3]/20 to-[#00897b]/20 flex items-center justify-center">
                  <Car className="w-7 h-7 text-[#1565c0]" />
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
          <Card className="border-l-4 border-l-[#2e7d32] hover:shadow-lg transition-all bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Now</p>
                  <p className="text-3xl font-bold mt-1 text-foreground">
                    <AnimatedCounter value={availableVehicles} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">ready for rental</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2e7d32]/20 to-[#4caf50]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-[#2e7d32]" />
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
          <Card className="border-l-4 border-l-[#0097a7] hover:shadow-lg transition-all bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Use</p>
                  <p className="text-3xl font-bold mt-1 text-foreground">
                    <AnimatedCounter value={inUseVehicles} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">currently rented</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0097a7]/20 to-[#00bcd4]/20 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-[#0097a7]" />
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
          <Card className="border-l-4 border-l-[#dc2626] hover:shadow-lg transition-all bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Needs Repair</p>
                  <p className="text-3xl font-bold mt-1 text-foreground">
                    <AnimatedCounter value={needsRepairVehicles} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">requires attention</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#dc2626]/20 to-[#ef4444]/20 flex items-center justify-center">
                  <Wrench className="w-7 h-7 text-[#dc2626]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fleet Health & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Health Overview */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Fleet Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={fleetHealthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {fleetHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {fleetHealthData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'check-out' 
                        ? 'bg-gradient-to-br from-[#2e7d32]/20 to-[#4caf50]/20' 
                        : 'bg-gradient-to-br from-[#2196f3]/20 to-[#42a5f5]/20'
                    }`}>
                      {activity.type === 'check-out' ? (
                        <TrendingUp className="w-5 h-5 text-[#2e7d32]" />
                      ) : (
                        <Clock className="w-5 h-5 text-[#2196f3]" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{activity.vehicle}</p>
                      <p className="text-xs text-muted-foreground">{activity.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{activity.time}</p>
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Damage Reports & Maintenance Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Damage Alerts */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-[#dc2626]" />
              Recent Damage Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDamageReports.slice(0, 3).map((report) => (
                <div 
                  key={report.id}
                  className="flex items-start gap-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors bg-card"
                >
                  <img 
                    src={report.vehicleImageUrl} 
                    alt={report.vehicleNumber}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-foreground">{report.vehicleNumber}</p>
                      <Badge 
                        variant="outline"
                        className={
                          report.damage.severity === 'severe' 
                            ? 'border-[#dc2626] text-[#dc2626]'
                            : report.damage.severity === 'moderate'
                            ? 'border-[#fbbf24] text-[#fbbf24]'
                            : 'border-[#2e7d32] text-[#2e7d32]'
                        }
                      >
                        {report.damage.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{report.damage.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(report.dateDetected).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Predictions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <Wrench className="w-5 h-5 text-[#2196f3]" />
              AI Maintenance Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMaintenancePredictions.map((prediction) => (
                <div key={prediction.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{prediction.vehicleNumber}</p>
                      <p className="text-xs text-muted-foreground">{prediction.predictedIssue}</p>
                    </div>
                    <Badge 
                      variant={
                        prediction.priority === 'high' 
                          ? 'destructive' 
                          : prediction.priority === 'medium' 
                          ? 'default' 
                          : 'outline'
                      }
                    >
                      {prediction.priority}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">AI Confidence</span>
                      <motion.span 
                        className="font-semibold text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {prediction.confidence}%
                      </motion.span>
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended by: {new Date(prediction.recommendedDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Damage Statistics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Damage Analysis - This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={damageByTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
              <XAxis dataKey="type" stroke="currentColor" className="text-muted-foreground" />
              <YAxis stroke="currentColor" className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#2196f3" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inspections */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ClipboardList className="w-5 h-5 text-[#2196f3]" />
              Recent Inspections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInspections.slice(0, 5).map((inspection) => (
                <div key={inspection.id} className="flex items-center gap-4 p-3 bg-muted/50 dark:bg-muted/20 rounded-lg hover:bg-muted transition-colors">
                  <div 
                    className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ 
                      backgroundImage: `url(${mockVehicles.find(v => v.id === inspection.vehicleId)?.imageUrl || 'https://images.unsplash.com/photo-1732273758145-2e2c781637fa?w=200'})` 
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {mockVehicles.find(v => v.id === inspection.vehicleId)?.number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inspection.type === 'check-in' ? 'Check-in' : 'Check-out'} • {new Date(inspection.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Driver: {inspection.driverName}</p>
                  </div>
                  <Badge variant={inspection.damagesDetected > 0 ? 'destructive' : 'default'}>
                    {inspection.damagesDetected} damage{inspection.damagesDetected !== 1 ? 's' : ''}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Inspections</Button>
          </CardContent>
        </Card>

        {/* Fleet Locations Map Preview */}
        <Card className="relative overflow-hidden bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MapPin className="w-5 h-5 text-[#2e7d32]" />
              Fleet Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 rounded-lg overflow-hidden mb-4">
              <img 
                src="https://images.unsplash.com/photo-1580635849262-3161a7c99dac?w=800" 
                alt="Sri Lanka Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/80 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-3xl font-bold mb-2">
                    <AnimatedCounter value={mockVehicles.length} duration={1500} />
                  </p>
                  <p className="text-[#bbdefb] text-sm">Vehicles Across Sri Lanka</p>
                </div>
              </div>
              {/* Location Pins */}
              <motion.div 
                className="absolute top-1/4 left-1/3 w-3 h-3 bg-[#2e7d32] rounded-full shadow-lg shadow-[#2e7d32]/50"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#2196f3] rounded-full shadow-lg shadow-[#2196f3]/50"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              />
              <motion.div 
                className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-[#0097a7] rounded-full shadow-lg shadow-[#0097a7]/50"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
              />
            </div>
            <div className="space-y-2">
              {[
                { location: 'Colombo', count: 12 },
                { location: 'Kandy', count: 8 },
                { location: 'Galle', count: 6 },
                { location: 'Negombo', count: 5 },
              ].map((area) => (
                <div key={area.location} className="flex items-center justify-between p-2 bg-muted/50 dark:bg-muted/20 rounded">
                  <span className="text-sm text-foreground">{area.location}</span>
                  <Badge variant="secondary">{area.count} vehicles</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
