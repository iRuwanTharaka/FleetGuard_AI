import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Sparkles, MapPin, Activity, Star, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export function SmartAssignment() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    pickupLocation: '',
    dropoffLocation: '',
    passengers: '',
  });

  const recommendations = [
    { rank: 1, id: 'CAB-4523', make: 'Toyota Prius 2020', health: 92, distance: '2.3 km', matchScore: 94, tier: 'Premium' },
    { rank: 2, id: 'CAB-7612', make: 'Nissan Leaf 2022', health: 95, distance: '3.8 km', matchScore: 91, tier: 'Premium' },
    { rank: 3, id: 'CAB-2891', make: 'Honda Civic 2021', health: 87, distance: '4.2 km', matchScore: 85, tier: 'Standard' },
  ];

  const handleFindVehicles = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRecommendations(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300 mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI-Powered</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Smart Vehicle Assignment</h1>
        <p className="text-slate-600 dark:text-slate-400">AI recommends the best vehicles based on health, location, and availability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Booking Details</h2>
            <form onSubmit={handleFindVehicles} className="space-y-4">
              <div>
                <Label htmlFor="customerName" className="text-slate-700 dark:text-slate-300">Customer Name *</Label>
                <Input
                  id="customerName"
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pickupLocation" className="text-slate-700 dark:text-slate-300">Pickup Location *</Label>
                <Input
                  id="pickupLocation"
                  placeholder="Colombo Fort"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dropoffLocation" className="text-slate-700 dark:text-slate-300">Drop-off Location *</Label>
                <Input
                  id="dropoffLocation"
                  placeholder="Galle"
                  value={formData.dropoffLocation}
                  onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="passengers" className="text-slate-700 dark:text-slate-300">Number of Passengers</Label>
                <Input
                  id="passengers"
                  type="number"
                  placeholder="4"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Find Best Vehicles
              </Button>
            </form>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          {showRecommendations ? (
            <>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
                <div className="relative p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">AI Recommendations</h2>
                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <RecommendationCard key={rec.id} recommendation={rec} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="relative rounded-2xl overflow-hidden h-full">
              <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
              <div className="relative p-6 h-full flex flex-col items-center justify-center text-center">
                <Sparkles className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Find the Best Match</h3>
                <p className="text-slate-600 dark:text-slate-400">Fill in the booking details to get AI-powered vehicle recommendations</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: any) {
  const getBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-300';
    if (rank === 2) return 'bg-slate-200/50 dark:bg-white/10 border-slate-300/50 dark:border-white/20 text-slate-900 dark:text-white';
    return 'bg-slate-300/30 dark:bg-slate-500/20 border-slate-400/50 dark:border-slate-500/30 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getBadgeColor(recommendation.rank)} mb-2`}>
              #{recommendation.rank} {recommendation.rank === 1 ? 'Best Match' : recommendation.rank === 2 ? 'Good Match' : 'Alternative'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{recommendation.id}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{recommendation.make}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{recommendation.matchScore}</p>
            <p className="text-xs text-slate-500">Match Score</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-slate-500">Health</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{recommendation.health}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-slate-500">Distance</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{recommendation.distance}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Tier</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{recommendation.tier}</p>
            </div>
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Assign This Vehicle
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
