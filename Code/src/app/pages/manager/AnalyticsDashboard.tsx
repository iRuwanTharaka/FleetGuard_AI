import { Button } from '@/app/components/ui/button';
import { Download, TrendingUp, FileText, Activity, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Sample data for charts
const inspectionData = [
  { name: 'Week 1', inspections: 35 },
  { name: 'Week 2', inspections: 42 },
  { name: 'Week 3', inspections: 38 },
  { name: 'Week 4', inspections: 41 },
];

const healthScoreData = [
  { range: '0-20', count: 2 },
  { range: '21-40', count: 5 },
  { range: '41-60', count: 8 },
  { range: '61-80', count: 21 },
  { range: '81-100', count: 19 },
];

const damageTypeData = [
  { name: 'Dent', value: 34 },
  { name: 'Scratch', value: 28 },
  { name: 'Crack', value: 15 },
  { name: 'Missing Part', value: 12 },
];

const fleetStatusData = [
  { name: 'Jan', available: 28, inUse: 15, maintenance: 4 },
  { name: 'Feb', available: 30, inUse: 13, maintenance: 4 },
  { name: 'Mar', available: 32, inUse: 12, maintenance: 3 },
  { name: 'Apr', available: 29, inUse: 14, maintenance: 4 },
];

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export function AnalyticsDashboard() {
  return (
    <div className="min-h-screen relative">
      {/* Professional Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwY2hhcnRzfGVufDF8fHx8MTc2OTQ5MzM4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwY2hhcnRzfGVufDF8fHx8MTc2OTQ5MzM4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Header"
                className="w-full h-full object-cover scale-110 animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-200/60 via-slate-100/80 to-slate-50 dark:from-slate-900/70 dark:via-slate-900/80 dark:to-slate-950"></div>
            </div>
            <div className="relative h-full flex items-center justify-between px-6 sm:px-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Analytics & Reports</h1>
                <p className="text-slate-700 dark:text-slate-300">Last 30 days performance</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Inspections"
            value="156"
            change="+12%"
            trend="up"
            icon={<FileText className="h-5 w-5" />}
          />
          <KPICard
            title="Avg Health Score"
            value="78/100"
            change="-3 points"
            trend="down"
            icon={<Activity className="h-5 w-5" />}
          />
          <KPICard
            title="Total Damages"
            value="89"
            change="+8%"
            trend="up"
            icon={<AlertCircle className="h-5 w-5" />}
          />
          <KPICard
            title="Fleet Utilization"
            value="68%"
            change="+5%"
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Inspections Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={inspectionData}>
                <defs>
                  <linearGradient id="colorInspections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="inspections" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorInspections)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Health Score Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="range" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Damage Types Breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={damageTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {damageTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Fleet Status Overview">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fleetStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Line type="monotone" dataKey="available" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="inUse" stroke="#60a5fa" strokeWidth={2} />
                <Line type="monotone" dataKey="maintenance" stroke="#94a3b8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Table */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Detailed Inspection Report</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300/50 dark:border-white/10">
                    <th className="text-left text-slate-600 dark:text-slate-400 pb-3 font-medium">Date</th>
                    <th className="text-left text-slate-600 dark:text-slate-400 pb-3 font-medium">Vehicle</th>
                    <th className="text-left text-slate-600 dark:text-slate-400 pb-3 font-medium">Customer</th>
                    <th className="text-left text-slate-600 dark:text-slate-400 pb-3 font-medium">Health</th>
                    <th className="text-left text-slate-600 dark:text-slate-400 pb-3 font-medium">Damages</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { days: 1, vehicle: 'CAB-4523', customer: 'Rajesh Kumar', health: 92, damages: 1 },
                    { days: 2, vehicle: 'CAB-2891', customer: 'Priya Silva', health: 87, damages: 2 },
                    { days: 3, vehicle: 'VAN-1234', customer: 'Anil Fernando', health: 68, damages: 5 },
                    { days: 4, vehicle: 'SUV-5678', customer: 'Lakshmi Perera', health: 95, damages: 0 },
                    { days: 5, vehicle: 'CAB-7612', customer: 'Sunil Wijesinghe', health: 85, damages: 3 },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-200/50 dark:border-white/5 hover:bg-slate-200/30 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 text-slate-900 dark:text-white">{row.days} day(s) ago</td>
                      <td className="py-3 text-slate-900 dark:text-white font-medium">{row.vehicle}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{row.customer}</td>
                      <td className="py-3">
                        <span className={`font-bold ${
                          row.health >= 85 ? 'text-blue-600 dark:text-blue-400' :
                          row.health >= 70 ? 'text-slate-600 dark:text-slate-400' :
                          'text-slate-500'
                        }`}>
                          {row.health}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-slate-600 dark:text-slate-400">{row.damages}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, trend, icon }: any) {
  const trendColor = trend === 'up' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500';

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white">
            {icon}
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
        <p className={`text-xs ${trendColor}`}>{change} vs last period</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}