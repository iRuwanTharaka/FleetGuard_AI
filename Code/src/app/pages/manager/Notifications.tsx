import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Bell, AlertCircle, FileText, Wrench, CheckCircle2, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { notificationService } from '@/services/notificationService';
import { timeAgo } from '@/utils/time';

type FilterType = 'all' | 'unread' | 'inspection' | 'damage' | 'maintenance';

export function Notifications() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [notificationsList, setNotificationsList] = useState<Array<{ id: number; type: string; title: string; message: string; time: string; read: boolean }>>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    notificationService.getAll()
      .then((data: any) => {
        const list = (data.notifications || []).map((n: any) => ({
          id: n.id,
          type: n.type || 'system',
          title: (n.type || 'Notification').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          message: n.message || '',
          time: timeAgo(n.created_at),
          read: !!n.is_read,
        }));
        setNotificationsList(list);
      })
      .catch(() => setNotificationsList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filteredNotifications = notificationsList.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'inspection') return n.type === 'inspection';
    if (activeFilter === 'damage') return n.type === 'damage';
    if (activeFilter === 'maintenance') return n.type === 'maintenance';
    return true;
  });

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    await notificationService.markAllRead();
    setNotificationsList(notificationsList.map(n => ({ ...n, read: true })));
  };

  const markAsRead = async (id: number) => {
    await notificationService.markRead(id);
    setNotificationsList(notificationsList.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: number) => {
    setNotificationsList(notificationsList.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen relative">
      {/* Professional Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1591121432666-6cb433b6dd2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RpZmljYXRpb24lMjBiZWxsJTIwdGVjaG5vbG9neSUyMGludGVyZmFjZXxlbnwxfHx8fDE3Njk1MjUyODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{unreadCount} unread notifications</p>
          </div>
          <Button 
            variant="outline" 
            className="border-slate-300/50 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-2">
            <div className="flex gap-2 overflow-x-auto">
              <FilterTab 
                label="All" 
                count={notificationsList.length} 
                active={activeFilter === 'all'}
                onClick={() => setActiveFilter('all')}
              />
              <FilterTab 
                label="Unread" 
                count={unreadCount} 
                active={activeFilter === 'unread'}
                onClick={() => setActiveFilter('unread')}
              />
              <FilterTab 
                label="Inspections" 
                count={notificationsList.filter(n => n.type === 'inspection').length} 
                active={activeFilter === 'inspection'}
                onClick={() => setActiveFilter('inspection')}
              />
              <FilterTab 
                label="Damages" 
                count={notificationsList.filter(n => n.type === 'damage').length} 
                active={activeFilter === 'damage'}
                onClick={() => setActiveFilter('damage')}
              />
              <FilterTab 
                label="Maintenance" 
                count={notificationsList.filter(n => n.type === 'maintenance').length} 
                active={activeFilter === 'maintenance'}
                onClick={() => setActiveFilter('maintenance')}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-slate-400 text-sm">
          {loading ? 'Loading...' : `Showing ${filteredNotifications.length} of ${notificationsList.length} notifications`}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <NotificationCard 
                key={notification.id} 
                notification={notification} 
                delay={index * 50}
                onDelete={() => deleteNotification(notification.id)}
                onMarkAsRead={() => markAsRead(notification.id)}
              />
            ))
          ) : (
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
              <div className="relative p-12 text-center">
                <Bell className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No notifications found</p>
                <p className="text-slate-500 text-sm mt-2">Try selecting a different filter</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterTab({ label, count, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${ active ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/30 dark:hover:bg-white/5'
      }`}
    >
      {label} {count > 0 && `(${count})`}
    </button>
  );
}

function NotificationCard({ notification, delay, onDelete, onMarkAsRead }: any) {
  const getIcon = () => {
    switch (notification.type) {
      case 'damage': return <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'inspection': return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'maintenance': return <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default: return <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer animate-fade-in-up ${
        !notification.read ? 'ring-2 ring-blue-500/30' : ''
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => !notification.read && onMarkAsRead()}
    >
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all"></div>
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {!notification.read && (
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
          )}
          <div className="w-12 h-12 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className={`font-bold ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                {notification.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-slate-500">{notification.time}</span>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead();
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{notification.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}