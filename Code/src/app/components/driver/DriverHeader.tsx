import { useNavigate } from 'react-router';
import { ArrowLeft, Menu, User, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Shield } from 'lucide-react';

interface DriverHeaderProps {
  title?: string;
  showBack?: boolean;
  showProfile?: boolean;
  showLocationStatus?: boolean;
  onBack?: () => void;
}

export function DriverHeader({
  title,
  showBack = false,
  showProfile = true,
  showLocationStatus = false,
  onBack,
}: DriverHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="font-semibold text-lg hidden sm:inline">FleetGuard AI</span>
            </div>
          )}
          {title && <h1 className="font-semibold text-lg">{title}</h1>}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {showLocationStatus && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Location Active</span>
            </div>
          )}

          {showProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/driver/profile')}>
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/driver/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/driver/history')}>
                  Inspection History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/')} className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}