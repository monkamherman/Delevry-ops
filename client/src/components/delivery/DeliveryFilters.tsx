import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { DeliveryFilters as DeliveryFiltersType } from '@/types/delivery';

interface DeliveryFiltersProps {
  filters: DeliveryFiltersType;
  onFiltersChange: (filters: DeliveryFiltersType) => void;
  className?: string;
}

export function DeliveryFilters({
  filters,
  onFiltersChange,
  className,
}: DeliveryFiltersProps) {
  type DeliveryStatus = 'En attente' | 'En cours' | 'Livré' | 'Annulé';
  
  const [isOpen, setIsOpen] = React.useState(false);
  
  const statusOptions: Array<{ value: DeliveryStatus; label: string }> = [
    { value: 'En attente', label: 'En attente' },
    { value: 'En cours', label: 'En cours' },
    { value: 'Livré', label: 'Livré' },
    { value: 'Annulé', label: 'Annulé' },
  ];


  const handleStatusChange = (status: DeliveryStatus, checked: boolean) => {
    const newStatusFilters = filters.status ? [...filters.status] : [];
    
    if (checked) {
      newStatusFilters.push(status);
    } else {
      const index = newStatusFilters.indexOf(status);
      if (index > -1) {
        newStatusFilters.splice(index, 1);
      }
    }
    
    onFiltersChange({
      ...filters,
      status: newStatusFilters.length > 0 ? newStatusFilters : undefined,
    });
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: range?.from && range.to ? {
        from: range.from,
        to: range.to
      } : undefined,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchQuery: e.target.value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = 
    (filters.status && filters.status.length > 0) || 
    filters.dateRange?.from ||
    filters.searchQuery;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Rechercher une livraison..."
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            className="pl-9"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {filters.searchQuery && (
            <button
              onClick={() => {
                const event = { target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleSearchChange(event);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtres
              {hasActiveFilters && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {[filters.status?.length, filters.dateRange?.from ? 1 : 0].filter(Boolean).length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-4" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Statut</h4>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`status-${option.value}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={filters.status?.includes(option.value) || false}
                        onChange={(e) => handleStatusChange(option.value, e.target.checked)}
                      />
                      <Label
                        htmlFor={`status-${option.value}`}
                        className="ml-2 text-sm font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">Date de livraison</h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.dateRange?.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange?.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, 'PPP', { locale: fr })} -{' '}
                            {format(filters.dateRange.to, 'PPP', { locale: fr })}
                          </>
                        ) : (
                          format(filters.dateRange.from, 'PPP', { locale: fr })
                        )
                      ) : (
                        <span>Choisir une période</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange?.from}
                      selected={{
                        from: filters.dateRange?.from,
                        to: filters.dateRange?.to,
                      }}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  Réinitialiser
                </Button>
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Appliquer
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.status?.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {status}
              <button
                onClick={() => handleStatusChange(status, false)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.dateRange?.from && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.dateRange.to
                ? `${format(filters.dateRange.from, 'dd MMM', { locale: fr })} - ${format(filters.dateRange.to, 'dd MMM yyyy', { locale: fr })}`
                : `Le ${format(filters.dateRange.from, 'PPP', { locale: fr })}`}
              <button
                onClick={() => handleDateRangeChange({})}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-sm text-primary"
            onClick={clearFilters}
          >
            Tout effacer
          </Button>
        </div>
      )}
    </div>
  );
}
