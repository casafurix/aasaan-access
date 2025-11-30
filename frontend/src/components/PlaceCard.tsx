import { Place, categoryLabels, accessibilityStatusLabels } from '@/types/place';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle,
  Accessibility,
  DoorOpen,
  Bath,
  Eye,
  Volume2,
  BookOpen,
  Sun,
  HeadphonesIcon,
  UserRoundCheck,
  Edit,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContributionForm } from './ContributionForm';

interface PlaceCardProps {
  place: Place;
  onClose: () => void;
}

const statusConfig = {
  accessible: {
    icon: CheckCircle2,
    className: 'status-accessible',
    bgClass: 'bg-status-accessible/10',
  },
  partially_accessible: {
    icon: AlertCircle,
    className: 'status-partial',
    bgClass: 'bg-status-partial/10',
  },
  not_accessible: {
    icon: XCircle,
    className: 'status-not-accessible',
    bgClass: 'bg-status-not-accessible/10',
  },
  unknown: {
    icon: HelpCircle,
    className: 'status-unknown',
    bgClass: 'bg-status-unknown/10',
  },
};

export function PlaceCard({ place, onClose }: PlaceCardProps) {
  const config = statusConfig[place.accessibility_status];
  const StatusIcon = config.icon;

  const attributes = [
    { key: 'ramp_present', label: 'Ramp', icon: Accessibility, value: place.ramp_present },
    { key: 'step_free_entrance', label: 'Step-free Entrance', icon: DoorOpen, value: place.step_free_entrance },
    { key: 'accessible_restroom', label: 'Accessible Restroom', icon: Bath, value: place.accessible_restroom !== 'none', detail: place.accessible_restroom },
    { key: 'tactile_paving', label: 'Tactile Paving', icon: Eye, value: place.tactile_paving },
    { key: 'audio_signage', label: 'Audio Signage', icon: Volume2, value: place.audio_signage },
    { key: 'braille_signage', label: 'Braille Signage', icon: BookOpen, value: place.braille_signage },
    { key: 'staff_assistance', label: 'Staff Assistance', icon: UserRoundCheck, value: place.staff_assistance_available },
  ];

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className={cn('p-4 border-b border-border', config.bgClass)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs shrink-0">
                {categoryLabels[place.category] || place.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg text-foreground leading-tight">
              {place.name}
            </h3>
            {place.name_local && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {place.name_local}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Status Badge */}
        <div className={cn('status-badge mt-3', config.className)}>
          <StatusIcon className="w-4 h-4" />
          {accessibilityStatusLabels[place.accessibility_status]}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Address */}
        {place.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{place.address}</span>
          </div>
        )}

        {/* Accessibility Attributes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Accessibility Features</h4>
          <div className="grid grid-cols-2 gap-2">
            {attributes.map(attr => (
              <div
                key={attr.key}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  attr.value
                    ? 'bg-status-accessible/10 text-status-accessible'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <attr.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{attr.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Environment */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Environment</h4>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm">
              <Sun className="w-4 h-4" />
              <span>Lighting: {place.lighting_level}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm">
              <HeadphonesIcon className="w-4 h-4" />
              <span>Noise: {place.noise_level}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {place.notes && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Notes</h4>
            <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
              {place.notes}
            </p>
          </div>
        )}

        {/* Photo */}
        {place.photo_url && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Photo</h4>
            <img
              src={place.photo_url}
              alt={`Photo of ${place.name}`}
              className="w-full rounded-lg object-cover max-h-48"
            />
          </div>
        )}

        {/* Metadata */}
        <div className="pt-2 border-t border-border text-xs text-muted-foreground space-y-1">
          <p>Last updated: {new Date(place.updated_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}</p>
          <p>Data source: {place.source === 'osm' ? 'OpenStreetMap' : place.source === 'user' ? 'Community' : 'Official'}</p>
        </div>
      </div>

      {/* Footer - CTA */}
      <div className="p-4 border-t border-border bg-muted/30">
        <ContributionForm
          placeId={place.id}
          placeName={place.name}
          trigger={
            <Button className="w-full gap-2" variant="default">
              <Edit className="w-4 h-4" />
              Suggest an Edit
            </Button>
          }
        />
        <p className="text-xs text-center text-muted-foreground mt-2">
          Help us improve accessibility data for everyone
        </p>
      </div>
    </div>
  );
}
