import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, DollarSign, Shield, Wrench, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

// Animated Counter Component
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
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

export function Analytics() {
  // Fleet Health Trend Data
  const healthTrendData = [
    { month: 'Aug', avgScore: 82 },
    { month: 'Sep', avgScore: 85 },
    { month: 'Oct', avgScore: 83 },
    { month: 'Nov', avgScore: 87 },
    { month: 'Dec', avgScore: 88 },
    { month: 'Jan', avgScore: 90 },
  ];

  // Damage by Vehicle Type
  const damageByVehicleType = [
    { type: 'Van', damages: 8 },
    { type: 'Car', damages: 4 },
    { type: 'SUV', damages: 6 },
    { type: 'Tuk-Tuk', damages: 2 },
  ];

  // Monthly Inspection Volume
  const inspectionVolumeData = [
    { month: 'Aug', checkouts: 45, checkins: 42 },
    { month: 'Sep', checkouts: 52, checkins: 48 },
    { month: 'Oct', checkouts: 48, checkins: 50 },
    { month: 'Nov', checkouts: 58, checkins: 55 },
    { month: 'Dec', checkouts: 65, checkins: 63 },
    { month: 'Jan', checkouts: 42, checkins: 38 },
  ];

  // Cost Savings Data
  const costSavingsData = [
    { category: 'Fraud Prevention', amount: 2500000, color: '#2e7d32' },
    { category: 'Maintenance Optimization', amount: 1800000, color: '#2196f3' },
    { category: 'Insurance Savings', amount: 1200000, color: '#fbbf24' },
  ];

  // Damage by Location/Route
  const damageByRouteData = [
    { route: 'Colombo-Kandy', incidents: 12 },
    { route: 'Colombo-Galle', incidents: 8 },
    { route: 'Kandy-Nuwara Eliya', incidents: 15 },
    { route: 'Colombo-Negombo', incidents: 5 },
  ];

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
            backgroundImage: 'url(https://images.unsplash.com/photo-1664256608032-3007263ab0d6?w=1200)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/95 via-[#0a1929]/80 to-transparent dark:from-[#0a1929]/95 dark:via-[#0a1929]/80" />
        <div className="relative z-10 h-full flex items-center p-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2196f3]/20 to-[#2e7d32]/20 border border-[#2196f3]/30 rounded-full px-4 py-2 mb-3 backdrop-blur-sm">
              <BarChart3 className="w-4 h-4 text-[#4caf50]" />
              <span className="text-sm text-[#90caf9] dark:text-[#90caf9] font-medium">Data-Driven Intelligence</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Analytics & Insights</h1>
            <p className="text-lg text-[#bbdefb]">Data-driven insights to optimize your fleet operations</p>
          </div>
        </div>
      </motion.div>

      {/* Financial Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-[#2e7d32] bg-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fraud Prevention Savings</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    Rs. 2.5M
                  </p>
                  <p className="text-xs text-[#2e7d32] dark:text-[#4caf50] mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +18% from last quarter
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2e7d32]/20 to-[#4caf50]/20 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-[#2e7d32]" />
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
                  <p className="text-sm text-muted-foreground">Maintenance Optimization</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    Rs. 1.8M
                  </p>
                  <p className="text-xs text-[#2196f3] dark:text-[#42a5f5] mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% from last quarter
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2196f3]/20 to-[#42a5f5]/20 flex items-center justify-center">
                  <Wrench className="w-7 h-7 text-[#2196f3]" />
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
          <Card className="border-l-4 border-l-[#0097a7] bg-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Insurance Cost Reduction</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    Rs. 1.2M
                  </p>
                  <p className="text-xs text-[#0097a7] dark:text-[#00bcd4] mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +8% from last quarter
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0097a7]/20 to-[#00bcd4]/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-[#0097a7]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fleet Health Trend */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Fleet Health Trends (6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={healthTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
              <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground" />
              <YAxis domain={[0, 100]} stroke="currentColor" className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                stroke="#2196f3" 
                strokeWidth={3}
                name="Average Health Score"
                dot={{ fill: '#2196f3', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Damage Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Damage by Vehicle Type */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Damage Incidents by Vehicle Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={damageByVehicleType}>
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
                <Bar 
                  dataKey="damages" 
                  fill="#dc2626" 
                  radius={[8, 8, 0, 0]}
                  name="Damage Incidents"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Savings Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Cost Savings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={costSavingsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {costSavingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `Rs. ${(value / 1000).toFixed(1)}K`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {costSavingsData.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-foreground">{item.category}</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-foreground ml-5">
                      Rs. {(item.amount / 1000000).toFixed(1)}M
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inspection Volume & Damage by Route */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Inspection Volume */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Monthly Inspection Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inspectionVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
                <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground" />
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
                <Bar dataKey="checkouts" fill="#2e7d32" name="Check-outs" />
                <Bar dataKey="checkins" fill="#2196f3" name="Check-ins" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Damage by Route */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Damage Incidents by Route</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={damageByRouteData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
                <XAxis type="number" stroke="currentColor" className="text-muted-foreground" />
                <YAxis type="category" dataKey="route" width={150} stroke="currentColor" className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="incidents" 
                  fill="#dc2626" 
                  radius={[0, 8, 8, 0]}
                  name="Incidents"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Insights */}
      <Card className="bg-gradient-to-r from-[#2196f3]/10 to-[#2e7d32]/10 dark:from-[#2196f3]/20 dark:to-[#2e7d32]/20 border-l-4 border-l-[#2196f3] border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2196f3]" />
            AI-Powered Predictive Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Tourist Season Forecast</p>
              <p className="font-semibold text-foreground">
                Peak demand expected in 30 days
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Ensure 80% fleet availability
              </p>
            </div>
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Route Impact Analysis</p>
              <p className="font-semibold text-foreground">
                Mountain routes cause 40% more tire wear
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Increase tire inspection frequency
              </p>
            </div>
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Seasonal Maintenance</p>
              <p className="font-semibold text-foreground">
                Monsoon season in 45 days
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Schedule brake and wiper checks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
