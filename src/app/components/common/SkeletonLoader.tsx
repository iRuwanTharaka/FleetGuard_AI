import { Skeleton } from '@/app/components/ui/skeleton';

interface SkeletonLoaderProps {
  rows?: number;
  height?: number;
  className?: string;
}

export function SkeletonLoader({ rows = 3, height = 20, className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="w-full" style={{ height, borderRadius: 6 }} />
      ))}
    </div>
  );
}

export default SkeletonLoader;
