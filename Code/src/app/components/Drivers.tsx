import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { mockDrivers } from '@/data/mockData';
import { Phone, Award, TrendingUp, Users, Calendar, UserCheck } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { motion } from 'motion/react';

export function Drivers() {
  const totalDrivers = mockDrivers.length;
  const activeToday = mockDrivers.filter(d => d.status === 'on-duty').length;
  const topPerformer = mockDrivers.reduce((prev, current) => 
    (prev.performanceScore > current.performanceScore) ? prev : current
  );
  const avgRating = Math.round(
    mockDrivers.reduce((sum, d) => sum + d.performanceScore, 0) / totalDrivers
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-duty':
        return <Badge className="bg-[#2e7d32] dark:bg-[#4caf50] text-white">On Duty</Badge>;
      case 'available':
        return <Badge className="bg-[#2196f3] dark:bg-[#42a5f5] text-white">Available</Badge>;
      case 'off-duty':
        return <Badge variant="outline" className="border-border text-muted-foreground">Off Duty</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-[#2e7d32] dark:text-[#4caf50]';
    if (score >= 75) return 'text-[#fbbf24] dark:text-[#fcd34d]';
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1704798690646-92524b61ce03?w=1200)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/95 via-[#0a1929]/80 to-transparent dark:from-[#0a1929]/95 dark:via-[#0a1929]/80" />
        <div className="relative z-10 h-full flex items-center p-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2196f3]/20 to-[#2e7d32]/20 border border-[#2196f3]/30 rounded-full px-4 py-2 mb-3 backdrop-blur-sm">
              <UserCheck className="w-4 h-4 text-[#4caf50]" />
              <span className="text-sm text-[#90caf9] dark:text-[#90caf9] font-medium">Professional Driver Team</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Drivers</h1>
            <p className="text-lg text-[#bbdefb]">Manage your driver team and monitor performance</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#2196f3] bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drivers</p>
                <p className="text-3xl font-bold text-foreground mt-1">{totalDrivers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2196f3]/20 to-[#42a5f5]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#2196f3]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2e7d32] bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-3xl font-bold text-foreground mt-1">{activeToday}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2e7d32]/20 to-[#4caf50]/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#2e7d32]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#fbbf24] bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Performer</p>
                <p className="text-lg font-bold text-foreground mt-1">{topPerformer.name}</p>
                <p className="text-xs text-muted-foreground">{topPerformer.performanceScore}% rating</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fbbf24]/20 to-[#fcd34d]/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#fbbf24]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#0097a7] bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-3xl font-bold text-foreground mt-1">{avgRating}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0097a7]/20 to-[#00bcd4]/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#0097a7]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDrivers.map((driver, index) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <Card className="hover:shadow-xl transition-all bg-card border-border">
              <CardContent className="p-6">
                {/* Header with Avatar */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={driver.photoUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-[#2196f3] to-[#0097a7] text-white">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-foreground">{driver.name}</h3>
                      <p className="text-xs text-muted-foreground">{driver.employeeId}</p>
                    </div>
                  </div>
                  {getStatusBadge(driver.status)}
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>License expires: {new Date(driver.licenseExpiry).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Performance Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Performance Score</span>
                    <span className={`font-bold ${getPerformanceColor(driver.performanceScore)}`}>
                      {driver.performanceScore}%
                    </span>
                  </div>
                  <Progress value={driver.performanceScore} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Inspections</p>
                    <p className="text-lg font-bold text-foreground">{driver.totalInspections}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Damage Rate</p>
                    <p className="text-lg font-bold text-foreground">{driver.damageIncidentRate}%</p>
                  </div>
                </div>

                {/* Actions */}
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Leaderboard */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#fbbf24]" />
            Performance Leaderboard
          </h3>
          <div className="space-y-3">
            {mockDrivers
              .sort((a, b) => b.performanceScore - a.performanceScore)
              .map((driver, index) => (
                <div 
                  key={driver.id}
                  className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-[#fbbf24] text-white' :
                      index === 1 ? 'bg-muted-foreground/30 text-foreground' :
                      index === 2 ? 'bg-[#CD7F32] text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={driver.photoUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-[#2196f3] to-[#0097a7] text-white">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.totalInspections} inspections</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getPerformanceColor(driver.performanceScore)}`}>
                      {driver.performanceScore}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}