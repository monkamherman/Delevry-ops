import * as React from 'react';
import { DeliveryCard } from './DeliveryCard';
import { Delivery } from '@/types/delivery';
import { EmptyState } from '@/components/ui/empty-state';
import { Package } from 'lucide-react';

interface DeliveryListProps {
  deliveries: Delivery[];
  onTrack?: (id: string) => void;
  onDetails?: (id: string) => void;
  emptyStateMessage?: string;
  className?: string;
}

export function DeliveryList({
  deliveries,
  onTrack,
  onDetails,
  emptyStateMessage = 'Aucune livraison trouvée',
  className,
}: DeliveryListProps) {
  if (deliveries.length === 0) {
    return (
      <EmptyState 
        icon={Package}
        title="Aucune livraison"
        description={emptyStateMessage}
        className={className}
      />
    );
  }

  return (
    <div className={cn('grid gap-4', className)}>
      {deliveries.map((delivery) => (
        <DeliveryCard
          key={delivery.id}
          onTrack={onTrack}
          onDetails={onDetails}
          {...delivery}
        />
      ))}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
