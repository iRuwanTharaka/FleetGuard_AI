import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Search, Filter, Download, Calendar, Activity, FileText } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { inspectionService } from '@/services/inspectionService';
import { timeAgo } from '@/utils/time';

export function ManagerInspections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectionsFromApi, setInspectionsFromApi] = useState<Array<{
    id: number;
    number_plate: string;
    customer_name?: string;
    driver_name?: string;
    health_score?: number;
    status: string;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statusParam = activeTab === 'all' ? undefined : activeTab === 'pending' ? 'in_progress' : 'completed';
    inspectionService.getAll({ status: statusParam, search: searchQuery || undefined })
      .then((data: any) => setInspectionsFromApi(data.inspections || []))
      .catch(() => setInspectionsFromApi([]))
      .finally(() => setLoading(false));
  }, [activeTab, searchQuery]);

  const inspectionsList = inspectionsFromApi.map((i) => ({
    id: String(i.id),
    displayId: `#INS-${String(i.id).padStart(6, '0')}`,
    date: timeAgo(i.created_at),
    vehicleId: i.number_plate,
    driverName: i.customer_name ?? '—',
    inspector: i.driver_name ?? '—',
    health: i.health_score ?? 0,
    damages: 0,
    status: (i.status === 'completed' || i.status === 'reviewed' ? 'Completed' : 'Pending') as 'Completed' | 'Pending',
  }));

  const filteredInspections = inspectionsList.filter(inspection => {
    const matchesSearch =
      inspection.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen relative">
      {/* Professional Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1762542501470-ba35e8d732b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwaW5zcGVjdGlvbiUyMGF1dG9tb3RpdmUlMjBtb2Rlcm58ZW58MXx8fHwxNzY5NTI1Mjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-6 pb-6">
        {/* Hero Header */}
        <div className="relative -mx-4 sm:-mx-6 -mt-6 mb-8">
          <div className="relative h-40 overflow-hidden">
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1762542501470-ba35e8d732b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwaW5zcGVjdGlvbiUyMGF1dG9tb3RpdmUlMjBtb2Rlcm58ZW58MXx8fHwxNzY5NTI1Mjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Header"
                className="w-full h-full object-cover scale-110 animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-200/60 via-slate-100/80 to-slate-50 dark:from-slate-900/70 dark:via-slate-900/80 dark:to-slate-950"></div>
            </div>
            <div className="relative h-full flex flex-col justify-end px-6 sm:px-8 pb-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Inspections</h1>
              <p className="text-slate-700 dark:text-slate-300">Monitor and review all vehicle inspections</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              className={`${
                activeTab === 'all'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </Button>
            <Button
              className={`${
                activeTab === 'pending'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </Button>
            <Button
              className={`${
                activeTab === 'completed'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            title="This Month"
            value="156"
            change="+12% vs last month"
            icon={<FileText className="h-5 w-5" />}
          />
          <SummaryCard
            title="Avg Health Score"
            value="78/100"
            change="+3 points"
            icon={<Activity className="h-5 w-5" />}
          />
          <SummaryCard
            title="Damage Alerts"
            value="23"
            change="Needs attention"
            icon={<Calendar className="h-5 w-5" />}
            warning
          />
        </div>

        {/* Search and Filters */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 dark:text-slate-400" />
                <Input
                  placeholder="Search by vehicle, customer, inspector..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
                />
              </div>
              <Button variant="outline" className="border-slate-300/50 dark:border-white/10 text-slate-600 dark:text-slate-400">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Inspections List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading inspections...</p>
          ) : (
            filteredInspections.map((inspection, index) => (
              <InspectionCard
                key={inspection.id}
                inspection={inspection}
                delay={index * 50}
                onClick={() => navigate(`/manager/inspections/${inspection.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, change, icon, warning }: any) {
  return (
    <div className="relative rounded-2xl overflow-hidden animate-fade-in-up">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white">
            {icon}
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{title}</p>
        <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
        <p className={`text-xs ${warning ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>{change}</p>
      </div>
    </div>
  );
}

function InspectionCard({ inspection, delay, onClick }: any) {
  const healthColor = inspection.health >= 85 ? 'text-blue-600 dark:text-blue-400' : 
                      inspection.health >= 70 ? 'text-slate-600 dark:text-slate-400' : 
                      'text-slate-500';

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all"></div>
      <div className="relative p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white">{inspection.displayId ?? inspection.id}</h3>
              <span className="px-2 py-1 rounded text-xs bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300">
                {inspection.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Vehicle</p>
                <p className="text-slate-900 dark:text-white font-medium">{inspection.vehicleId}</p>
              </div>
              <div>
                <p className="text-slate-500">Customer</p>
                <p className="text-slate-900 dark:text-white font-medium">{inspection.driverName}</p>
              </div>
              <div>
                <p className="text-slate-500">Inspector</p>
                <p className="text-slate-900 dark:text-white font-medium">{inspection.inspector}</p>
              </div>
              <div>
                <p className="text-slate-500">Date</p>
                <p className="text-slate-900 dark:text-white font-medium">{inspection.date}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className={`text-3xl font-bold ${healthColor}`}>{inspection.health}</p>
              <p className="text-xs text-slate-500">Health</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-600 dark:text-slate-400">{inspection.damages}</p>
              <p className="text-xs text-slate-500">Damages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
