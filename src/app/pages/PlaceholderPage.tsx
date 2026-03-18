import { useNavigate, useLocation } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';

export function PlaceholderPage({ title }: { title: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <Construction className="h-16 w-16 text-[#1976d2] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-1">Route: {location.pathname}</p>
        <p className="text-sm text-gray-500 mb-6">This page is being built</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}