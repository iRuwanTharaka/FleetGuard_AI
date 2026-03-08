import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { 
  Search, 
  Calendar,
  MoreVertical,
  Eye,
  Download,
  Share2,
  Trash2,
  FileText,
  Gauge,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { inspectionService } from '@/services/inspectionService';
import { healthColor } from '@/utils/healthScore';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400';

const mockInspections: Array<{
  id: string;
  vehicleNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  customerName: string;
  date: Date;
  healthScore: number;
  damageCount: number;
  status: 'completed' | 'in_progress';
  image: string;
}> = [];

export function InspectionHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [inspectionsFromApi, setInspectionsFromApi] = useState<Array<{
    id: number;
    number_plate: string;
    make: string;
    model: string;
    health_score?: number;
    created_at: string;
    status: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inspectionService.getMine(1)
      .then((data) => setInspectionsFromApi(data.inspections || []))
      .catch(() => setInspectionsFromApi([]))
      .finally(() => setLoading(false));
  }, []);

  const inspectionsList: typeof mockInspections = inspectionsFromApi.map((i) => ({
    id: String(i.id),
    vehicleNumber: i.number_plate,
    vehicleMake: i.make,
    vehicleModel: i.model,
    customerName: '—',
    date: new Date(i.created_at),
    healthScore: i.health_score ?? 0,
    damageCount: 0,
    status: (i.status === 'completed' || i.status === 'in_progress' ? i.status : 'completed') as 'completed' | 'in_progress',
    image: PLACEHOLDER_IMAGE,
  }));

  const handleViewDetails = (inspectionId: string) => {
    navigate(`/driver/history/${inspectionId}`);
  };

  const handleDownload = (inspectionId: string) => {
    console.log('Download:', inspectionId);
  };

  const handleShare = (inspectionId: string) => {
    console.log('Share:', inspectionId);
  };

  const handleDelete = (inspectionId: string) => {
    if (window.confirm('Are you sure you want to delete this inspection?')) {
      console.log('Delete:', inspectionId);
    }
  };

  const filteredInspections = inspectionsList
    .filter((inspection) => {
      const matchesSearch =
        inspection.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inspection.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inspection.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || inspection.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.date.getTime() - a.date.getTime();
        case 'date-asc':
          return a.date.getTime() - b.date.getTime();
        case 'score-desc':
          return b.healthScore - a.healthScore;
        case 'score-asc':
          return a.healthScore - b.healthScore;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen relative">
      {/* Professional Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGFuYWx5dGljcyUyMGNoYXJ0fGVufDF8fHx8MTc2OTQ5NjEzOHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-6 pb-6">
        {/* Header */}
        <div className="relative -mx-4 sm:-mx-6 -mt-6 mb-8">
          <div className="relative h-40 overflow-hidden">
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1698998882494-57c3e043f340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcmVwYWlyJTIwd29ya3Nob3B8ZW58MXx8fHwxNzY5NDk2MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Header"
                className="w-full h-full object-cover scale-110 animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-950"></div>
            </div>
            <div className="relative h-full flex flex-col justify-end px-6 sm:px-8 pb-6">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Inspection History</h1>
              <p className="text-slate-300">View and manage all past inspections</p>
            </div>
          </div>
        </div>

        {/* Search & Filters - Glassmorphism */}
        <div className="space-y-3 animate-fade-in-up">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-5 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by vehicle number, customer or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-14 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white backdrop-blur-md">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white backdrop-blur-md">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="score-desc">Highest Score</SelectItem>
                <SelectItem value="score-asc">Lowest Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="px-1">
            <p className="text-sm text-slate-400">
              {filteredInspections.length} {filteredInspections.length === 1 ? 'inspection' : 'inspections'} found
            </p>
          </div>
        </div>

        {/* Inspection List */}
        {loading ? (
          <div className="p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
            <p className="text-slate-400">Loading inspections...</p>
          </div>
        ) : filteredInspections.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
            <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Inspections Found</h3>
            <p className="text-slate-400 mb-4">
              {searchQuery ? 'Try adjusting your search criteria' : 'Start your first inspection'}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInspections.map((inspection, index) => (
              <InspectionCard
                key={inspection.id}
                inspection={inspection}
                onView={() => handleViewDetails(inspection.id)}
                onDownload={() => handleDownload(inspection.id)}
                onShare={() => handleShare(inspection.id)}
                onDelete={() => handleDelete(inspection.id)}
                delay={index * 50}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InspectionCard({ inspection, onView, onDownload, onShare, onDelete, delay }: any) {
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onView}
    >
      {/* Glassmorphism Container */}
      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex flex-col sm:flex-row">
          {/* Vehicle Image */}
          <div className="relative h-40 sm:h-auto sm:w-48 bg-slate-800 overflow-hidden">
            <ImageWithFallback
              src={inspection.image}
              alt={inspection.vehicleNumber}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/40"></div>
            
            {/* Health Score Badge */}
            <div className="absolute top-4 left-4">
              <div
                className="px-3 py-2 rounded-xl backdrop-blur-md font-semibold flex items-center gap-2 border"
                style={{
                  backgroundColor: `${healthColor(inspection.healthScore)}20`,
                  color: healthColor(inspection.healthScore),
                  borderColor: `${healthColor(inspection.healthScore)}40`,
                }}
              >
                <Gauge className="h-4 w-4" />
                {inspection.healthScore}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{inspection.vehicleNumber}</h3>
                  <span className="px-2 py-0.5 rounded-lg text-xs bg-white/10 border border-white/20 text-slate-300">
                    {inspection.id}
                  </span>
                </div>
                <p className="text-slate-400 mb-1">{inspection.vehicleMake} {inspection.vehicleModel}</p>
                <p className="text-sm text-slate-500">{inspection.customerName}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload(); }}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(); }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-4 py-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="h-4 w-4" />
                {format(inspection.date, 'PP')}
              </div>
              {inspection.damageCount > 0 && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  {inspection.damageCount} {inspection.damageCount === 1 ? 'damage' : 'damages'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}