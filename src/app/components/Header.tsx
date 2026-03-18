import { useState } from 'react';
import { Bell, Search, User, Moon, Sun, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { Page } from '@/app/App';
import { toast } from 'sonner';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate?: (page: Page) => void;
  onLogout?: () => void;
}

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    type: 'damage',
    title: 'New Damage Detected',
    message: 'CAB-1234 - Front bumper scratch detected',
    time: '5 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'maintenance',
    title: 'Maintenance Alert',
    message: 'VAN-5678 needs tire rotation in 2 days',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    type: 'inspection',
    title: 'Inspection Complete',
    message: 'CAR-9012 check-in completed successfully',
    time: '3 hours ago',
    unread: true,
  },
];

export function Header({ isDarkMode, onToggleDarkMode, onNavigate, onLogout }: HeaderProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotificationClick = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, unread: false } : notif
      )
    );
    toast.success('Notification marked as read');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, unread: false }))
    );
    toast.success('All notifications marked as read');
    setIsOpen(false);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    toast.info('Notifications page coming soon');
  };

  const handleSettingsClick = () => {
    if (onNavigate) {
      onNavigate('settings');
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default behavior - reload to landing
      window.location.reload();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'damage':
        return '🔴';
      case 'maintenance':
        return '🔧';
      case 'inspection':
        return '✅';
      default:
        return '📢';
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search vehicles, drivers, customers..."
            className="pl-10 bg-input-background border-border focus-visible:ring-primary"
          />
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleDarkMode}
            className="hover:bg-accent"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-[#fbbf24] transition-transform hover:rotate-12" />
            ) : (
              <Moon className="w-5 h-5 text-[#2196f3] transition-transform hover:-rotate-12" />
            )}
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-accent transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-card border-border" align="end">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-[#2196f3]/10 text-[#2196f3] border-[#2196f3]/20">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                      notification.unread ? 'bg-[#2196f3]/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-semibold text-sm text-foreground">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-[#2196f3] rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
                <Button variant="ghost" className="w-full text-[#2196f3] hover:text-[#1976d2] hover:bg-[#2196f3]/10" onClick={handleMarkAllRead}>
                  Mark All as Read
                </Button>
                <Button variant="ghost" className="w-full text-[#2196f3] hover:text-[#1976d2] hover:bg-[#2196f3]/10" onClick={handleViewAll}>
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-accent rounded-xl px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary">
                <Avatar className="w-10 h-10 border-2 border-[#2196f3]/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                  <AvatarFallback className="bg-gradient-to-br from-[#2196f3] to-[#1565c0] text-white font-bold">
                    PS
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-foreground">Pradeep Silva</p>
                  <p className="text-xs text-muted-foreground">Fleet Manager</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted focus:text-foreground">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted focus:text-foreground"
                onClick={handleSettingsClick}
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                onClick={handleLogoutClick}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}