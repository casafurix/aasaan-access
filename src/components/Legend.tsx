import { accessibilityStatusLabels, accessibilityStatusColors, AccessibilityStatus } from '@/types/place';

export function Legend() {
  const statuses: AccessibilityStatus[] = ['accessible', 'partially_accessible', 'not_accessible', 'unknown'];

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Map Legend</h3>
      <div className="space-y-2">
        {statuses.map(status => (
          <div key={status} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: accessibilityStatusColors[status] }}
            />
            <span className="text-sm text-muted-foreground">
              {accessibilityStatusLabels[status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
