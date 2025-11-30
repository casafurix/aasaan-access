import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, accessibilityStatusColors } from '@/types/place';

interface AccessibilityMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  center?: [number, number];
  zoom?: number;
}

// Custom marker icon creator
const createMarkerIcon = (status: string) => {
  const color = accessibilityStatusColors[status as keyof typeof accessibilityStatusColors] || '#9ca3af';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export function AccessibilityMap({
  places,
  selectedPlace,
  onPlaceSelect,
  center = [19.0760, 72.8777], // Mumbai center
  zoom = 12,
}: AccessibilityMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | आसान Access',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Position zoom control
    mapRef.current.zoomControl.setPosition('topright');

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when places change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    places.forEach(place => {
      const marker = L.marker([place.latitude, place.longitude], {
        icon: createMarkerIcon(place.accessibility_status),
      });

      marker.on('click', () => {
        onPlaceSelect(place);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [places, onPlaceSelect]);

  // Pan to selected place
  useEffect(() => {
    if (!mapRef.current || !selectedPlace) return;

    mapRef.current.flyTo(
      [selectedPlace.latitude, selectedPlace.longitude],
      15,
      { duration: 0.5 }
    );
  }, [selectedPlace]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}
