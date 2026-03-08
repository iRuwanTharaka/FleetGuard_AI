import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Menu, User, Search, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ManagerHeaderProps {
  onMenuClick: () => void;
}

// Mock notifications
const initialNotifications = [
  {
    id: 1,
    type: 'damage',
    title: 'Severe Damage Alert',
    message: 'CAB-1234 - Major dent detected on rear bumper',
    time: '10 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'maintenance',
    title: 'Maintenance Due',
    message: 'VAN-5678 requires service in 3 days',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    type: 'inspection',
    title: 'Inspection Completed',
    message: 'Driver Kamal completed inspection for SUV-9012',
    time: '2 hours ago',
    unread: true,
  },
];

export function ManagerHeader({ onMenuClick }: ManagerHeaderProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
    setIsNotifOpen(false);
  };

  const handleViewAll = () => {
    setIsNotifOpen(false);
    navigate('/manager/notifications');
  };

  return (
    <header className="sticky top-0 z-20 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left - Menu Button (Mobile) */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex relative w-64 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles, inspections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Popover open={isNotifOpen} onOpenChange={setIsNotifOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="text-xs h-auto p-1"
                >
                  Mark all read
                </Button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 hover:bg-accent cursor-pointer transition-colors',
                          notification.unread && 'bg-accent/50'
                        )}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleViewAll}
                >
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                    PS
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-semibold">Pradeep Silva</p>
                  <p className="text-xs text-muted-foreground">manager@kith.lk</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/manager/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/manager/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/manager/help')}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate('/manager/login')}
                className="text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}