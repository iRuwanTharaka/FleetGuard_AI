import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Home,
  Camera,
  FileText,
  History,
  Settings,
  Car,
  CheckCircle,
  MessageCircle,
  User,
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Search,
  MapPin,
  Lock,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { toast } from 'sonner';
import logoFull from 'figma:asset/55aa009e656ec7bb3a1624f42ee7391769762ee0.png';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/driver/dashboard',
  },
  {
    title: 'New Inspection',
    icon: Camera,
    children: [
      {
        title: 'Select Vehicle',
        icon: Car,
        href: '/driver/select-vehicle',
      },
      {
        title: 'Customer Details',
        icon: FileText,
        href: '/driver/inspection/customer-details',
      },
      {
        title: 'Capture Photos',
        icon: Camera,
        href: '/driver/inspection/photos',
      },
    ],
  },
  {
    title: 'History',
    icon: History,
    href: '/driver/history',
  },
  {
    title: 'Profile',
    icon: User,
    children: [
      {
        title: 'View Profile',
        icon: User,
        href: '/driver/profile',
      },
      {
        title: 'Edit Profile',
        icon: Settings,
        href: '/driver/profile/edit',
      },
      {
        title: 'Change Password',
        icon: Lock,
        href: '/driver/profile/change-password',
      },
    ],
  },
];

export function DriverSidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>(['New Inspection', 'Profile']);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/driver/login');
    onClose();
  };

  // Filter navigation items based on search
  const filterNavItems = (items: NavItem[], query: string): NavItem[] => {
    if (!query) return items;

    return items
      .map((item) => {
        if (item.children) {
          const filteredChildren = item.children.filter((child) =>
            child.title.toLowerCase().includes(query.toLowerCase())
          );
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
        }
        if (item.title.toLowerCase().includes(query.toLowerCase())) {
          return item;
        }
        return null;
      })
      .filter(Boolean) as NavItem[];
  };

  const filteredNavigation = filterNavItems(navigationItems, searchQuery);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-72 transition-transform duration-300 shadow-2xl',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Dark Background with Glassmorphism */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main background - lighter in light mode, dark in dark mode */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
          
          {/* Glass effect layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-green-100/30 dark:from-blue-900/20 dark:via-transparent dark:to-green-900/20 backdrop-blur-xl"></div>
        </div>

        {/* Strong glass border */}
        <div className="absolute inset-0 border-r-2 border-slate-300/50 dark:border-slate-700/50 pointer-events-none shadow-2xl"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-300/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <img 
              src={logoFull} 
              alt="FleetGuard AI" 
              className="h-12 object-contain drop-shadow-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-white"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Driver Info */}
        <div className="p-4 border-b border-slate-300/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-xl ring-2 ring-slate-300/50 dark:ring-slate-700/50">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-slate-900 dark:text-white drop-shadow">
                Kamal Perera
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Driver ID: #DRV-0123
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-300/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">23</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Month</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-300/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">156</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-300/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">78</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Avg</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-300/50 dark:border-slate-700/50 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-300/60 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-lg focus:shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm">
          {filteredNavigation.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {expandedItems.includes(item.title) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href!}
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                            isActive(child.href!)
                              ? 'bg-blue-600/80 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                          )}
                        >
                          <child.icon className="w-4 h-4" />
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href!}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href!)
                      ? 'bg-blue-600/80 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer with Fading Image */}
        <div className="relative border-t border-slate-300/50 dark:border-slate-700/50 overflow-hidden">
          {/* Background Image with Gradient Fade */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1694962951262-a5f84ad0da68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYW4lMjBjdWx0dXJhbCUyMGhlcml0YWdlfGVufDF8fHx8MTc2OTUwMDI3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Sri Lankan Heritage"
              className="w-full h-full object-cover opacity-30"
            />
            {/* Gradient fade from top to bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-100/60 to-transparent dark:from-slate-900 dark:via-slate-900/60 dark:to-transparent"></div>
          </div>
          
          {/* Footer Content */}
          <div className="relative z-10 p-4 space-y-2 bg-gradient-to-b from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-xl">
          {/* GPS Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-100/60 dark:bg-green-900/40 backdrop-blur-md text-green-700 dark:text-green-300 text-sm border border-green-300/50 dark:border-green-700/50 shadow-lg">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">GPS Active</span>
            <span className="ml-auto text-xs">5m ago</span>
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-red-600 dark:text-red-400 border border-red-300/60 dark:border-red-800/60 hover:bg-red-50 dark:hover:bg-red-950/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
        </div>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}