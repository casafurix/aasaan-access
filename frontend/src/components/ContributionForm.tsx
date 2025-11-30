import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useContributions, ContributionData } from '@/hooks/useContributions';
import { categoryLabels } from '@/types/place';
import { Loader2, CheckCircle2, MapPin } from 'lucide-react';

interface ContributionFormProps {
  trigger: React.ReactNode;
  placeId?: string;
  placeName?: string;
  onSuccess?: () => void;
}

export function ContributionForm({ trigger, placeId, placeName, onSuccess }: ContributionFormProps) {
  const [open, setOpen] = useState(false);
  const { submitContribution, submitting, error, success, reset } = useContributions();
  
  const [formData, setFormData] = useState<Partial<ContributionData>>({
    name: placeName || '',
    category: '',
    latitude: 19.076,
    longitude: 72.8777,
    ramp_present: false,
    step_free_entrance: false,
    accessible_restroom: 'none',
    tactile_paving: false,
    audio_signage: false,
    braille_signage: false,
    lighting_level: 'medium',
    noise_level: 'medium',
    staff_assistance_available: false,
    place_id: placeId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      return;
    }

    try {
      await submitContribution(formData as ContributionData);
      onSuccess?.();
    } catch {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      reset();
      if (!placeId) {
        setFormData({
          name: '',
          category: '',
          latitude: 19.076,
          longitude: 72.8777,
          ramp_present: false,
          step_free_entrance: false,
          accessible_restroom: 'none',
          tactile_paving: false,
          audio_signage: false,
          braille_signage: false,
          lighting_level: 'medium',
          noise_level: 'medium',
          staff_assistance_available: false,
        });
      }
    }, 200);
  };

  const categories = Object.keys(categoryLabels);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {placeId ? 'Update Place Information' : 'Add a New Place'}
          </DialogTitle>
          <DialogDescription>
            Share accessibility information to help others navigate with confidence.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-4">
              Your contribution has been submitted for review. Once approved, it will appear on the map.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Place Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Central Library"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {categoryLabels[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Tip: Get coordinates from Google Maps by right-clicking on a location
              </p>
            </div>

            {/* Accessibility Features */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Accessibility Features</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'ramp_present', label: 'Ramp Available' },
                  { key: 'step_free_entrance', label: 'Step-free Entrance' },
                  { key: 'tactile_paving', label: 'Tactile Paving' },
                  { key: 'audio_signage', label: 'Audio Signage' },
                  { key: 'braille_signage', label: 'Braille Signage' },
                  { key: 'staff_assistance_available', label: 'Staff Assistance Available' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                    <Switch
                      id={key}
                      checked={!!formData[key as keyof ContributionData]}
                      onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Accessible Restroom</Label>
                  <Select
                    value={formData.accessible_restroom}
                    onValueChange={(value: 'none' | 'partial' | 'full') => 
                      setFormData({ ...formData, accessible_restroom: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Lighting Level</Label>
                  <Select
                    value={formData.lighting_level}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData({ ...formData, lighting_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Noise Level</Label>
                  <Select
                    value={formData.noise_level}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData({ ...formData, noise_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Notes & Contact */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Additional Info</h4>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional details about accessibility..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contributor_name">Your Name (optional)</Label>
                  <Input
                    id="contributor_name"
                    value={formData.contributor_name || ''}
                    onChange={(e) => setFormData({ ...formData, contributor_name: e.target.value })}
                    placeholder="Anonymous if left blank"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contributor_email">Your Email (optional)</Label>
                  <Input
                    id="contributor_email"
                    type="email"
                    value={formData.contributor_email || ''}
                    onChange={(e) => setFormData({ ...formData, contributor_email: e.target.value })}
                    placeholder="For updates on your contribution"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Contribution
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

