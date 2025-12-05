import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DeliveryCardProps {
  id: string;
  trackingNumber: string;
  status: 'En attente' | 'En cours' | 'Livré' | 'Annulé';
  deliveryAddress: string;
  estimatedDelivery?: string;
  deliveryDate?: string;
  className?: string;
  onTrack?: (id: string) => void;
  onDetails?: (id: string) => void;
}

export function DeliveryCard({
  id,
  trackingNumber,
  status,
  deliveryAddress,
  estimatedDelivery,
  deliveryDate,
  className,
  onTrack,
  onDetails
}: DeliveryCardProps) {
  const statusColors = {
    'En attente': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    'En cours': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    'Livré': 'bg-green-100 text-green-800 hover:bg-green-100',
    'Annulé': 'bg-red-100 text-red-800 hover:bg-red-100',
  };

  return (
    <Card className={cn('w-full overflow-hidden transition-shadow hover:shadow-md', className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="font-mono text-sm text-muted-foreground">
              {trackingNumber}
            </span>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              statusColors[status]
            )}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <p className="text-sm">{deliveryAddress}</p>
          </div>
          
          {estimatedDelivery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Livraison prévue: {estimatedDelivery}</span>
            </div>
          )}
          
          {deliveryDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Livré le: {deliveryDate}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 border-t p-4 pt-3">
        {onDetails && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDetails(id)}
          >
            Détails
          </Button>
        )}
        
        {onTrack && status === 'En cours' && (
          <Button 
            variant="default" 
            size="sm" 
            className="gap-2"
            onClick={() => onTrack(id)}
          >
            <Truck className="h-4 w-4" />
            Suivre
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
