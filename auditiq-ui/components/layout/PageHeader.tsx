import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between pb-6', className)}>
      <div>
        <h1 className="text-2xl font-heading font-medium text-[--text-primary]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[--text-secondary]">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
