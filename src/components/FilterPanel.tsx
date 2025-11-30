import { PlaceFilters, categoryLabels, accessibilityStatusLabels, AccessibilityStatus } from '@/types/place';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Filter, 
  X, 
  Accessibility, 
  DoorOpen, 
  Bath, 
  Eye, 
  Volume2, 
  BookOpen,
  UserRoundCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  filters: PlaceFilters;
  onFiltersChange: (filters: PlaceFilters) => void;
  categories: string[];
  totalCount: number;
  filteredCount: number;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  categories,
  totalCount,
  filteredCount,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusFilters: { value: AccessibilityStatus; color: string }[] = [
    { value: 'accessible', color: 'bg-status-accessible' },
    { value: 'partially_accessible', color: 'bg-status-partial' },
    { value: 'not_accessible', color: 'bg-status-not-accessible' },
    { value: 'unknown', color: 'bg-status-unknown' },
  ];

  const accessibilityFilters = [
    { key: 'ramp_present' as const, label: 'Ramp Available', icon: Accessibility },
    { key: 'step_free_entrance' as const, label: 'Step-free Entrance', icon: DoorOpen },
    { key: 'tactile_paving' as const, label: 'Tactile Paving', icon: Eye },
    { key: 'audio_signage' as const, label: 'Audio Signage', icon: Volume2 },
    { key: 'braille_signage' as const, label: 'Braille Signage', icon: BookOpen },
    { key: 'staff_assistance_available' as const, label: 'Staff Assistance', icon: UserRoundCheck },
  ];

  const toggleStatusFilter = (status: AccessibilityStatus) => {
    const currentStatuses = filters.accessibility_status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFiltersChange({
      ...filters,
      accessibility_status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const toggleCategoryFilter = (category: string) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const toggleBooleanFilter = (key: keyof PlaceFilters) => {
    onFiltersChange({
      ...filters,
      [key]: filters[key] ? undefined : true,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof PlaceFilters];
    return value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Filters</h3>
            <p className="text-sm text-muted-foreground">
              Showing {filteredCount} of {totalCount} places
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Active
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-5 border-t border-border">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Accessibility Status</Label>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map(({ value, color }) => (
                <button
                  key={value}
                  onClick={() => toggleStatusFilter(value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all',
                    filters.accessibility_status?.includes(value)
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                  )}
                >
                  <span className={cn('w-3 h-3 rounded-full', color)} />
                  {accessibilityStatusLabels[value]}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Required Features</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accessibilityFilters.map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <Switch
                    checked={!!filters[key]}
                    onCheckedChange={() => toggleBooleanFilter(key)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategoryFilter(category)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs border transition-all',
                    filters.category?.includes(category)
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-border bg-background text-muted-foreground hover:border-secondary/50'
                  )}
                >
                  {categoryLabels[category] || category}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full gap-2"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
