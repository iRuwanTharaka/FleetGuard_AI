import { Button } from '@/app/components/ui/button';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 my-4">
      <p className="text-red-600 dark:text-red-400 m-0">
        {message || 'Something went wrong. Please try again.'}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
          Retry
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
