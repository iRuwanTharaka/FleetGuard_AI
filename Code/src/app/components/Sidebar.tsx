import { Page } from '@/app/App';
import { 
  LayoutDashboard, 
  Car, 
  ClipboardList, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon,
  Shield,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const menuItems = [
  { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'fleet' as Page, icon: Car, label: 'Fleet Status' },
  { id: 'inspections' as Page, icon: ClipboardList, label: 'Inspections' },
  { id: 'damages' as Page, icon: AlertTriangle, label: 'Damage Reports' },
  { id: 'drivers' as Page, icon: Users, label: 'Drivers' },
  { id: 'analytics' as Page, icon: BarChart3, label: 'Analytics' },
  { id: 'settings' as Page, icon: SettingsIcon, label: 'Settings' },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2196f3] to-[#1565c0] flex items-center justify-center shadow-lg shadow-[#2196f3]/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl">FleetGuard AI</h1>
            <p className="text-xs text-[#90caf9]">Manager Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-gradient-to-r from-[#2196f3] to-[#1565c0] text-white shadow-lg shadow-[#2196f3]/20" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Help Card */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-gradient-to-br from-[#1565c0]/20 to-[#2196f3]/10 border border-[#2196f3]/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2196f3]/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-[#2196f3]" />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Need Help?</p>
              <p className="text-xs text-sidebar-foreground/60 mb-3">
                24/7 support for all agencies
              </p>
              <button className="text-xs text-[#2196f3] hover:text-[#1976d2] font-semibold flex items-center gap-1">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}