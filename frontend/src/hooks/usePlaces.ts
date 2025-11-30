import { useState, useEffect, useMemo, useCallback } from 'react';
import { Place, PlaceFilters } from '@/types/place';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PlaceFilters>({});

  // Fetch places data from backend API
  useEffect(() => {
    async function fetchPlaces() {
      try {
        // Fetch all places (with large page size to get all)
        const response = await fetch(`${API_URL}/places?page_size=100`);
        if (!response.ok) {
          throw new Error('Failed to fetch places data');
        }
        const data = await response.json();
        setPlaces(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Fallback to static data if API fails
        try {
          const fallbackResponse = await fetch('/data/places.json');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setPlaces(fallbackData);
            setError(null);
          }
        } catch {
          // Keep the original error
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(places.map(p => p.category));
    return Array.from(cats).sort();
  }, [places]);

  // Filter places based on current filters
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      // Status filter
      if (filters.accessibility_status && filters.accessibility_status.length > 0) {
        if (!filters.accessibility_status.includes(place.accessibility_status)) {
          return false;
        }
      }

      // Category filter
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(place.category)) {
          return false;
        }
      }

      // Boolean filters
      if (filters.ramp_present && !place.ramp_present) return false;
      if (filters.step_free_entrance && !place.step_free_entrance) return false;
      if (filters.tactile_paving && !place.tactile_paving) return false;
      if (filters.audio_signage && !place.audio_signage) return false;
      if (filters.braille_signage && !place.braille_signage) return false;
      if (filters.staff_assistance_available && !place.staff_assistance_available) return false;

      return true;
    });
  }, [places, filters]);

  // Stats
  const stats = useMemo(() => {
    const total = places.length;
    const accessible = places.filter(p => p.accessibility_status === 'accessible').length;
    const partial = places.filter(p => p.accessibility_status === 'partially_accessible').length;
    const notAccessible = places.filter(p => p.accessibility_status === 'not_accessible').length;
    const unknown = places.filter(p => p.accessibility_status === 'unknown').length;

    return {
      total,
      accessible,
      partial,
      notAccessible,
      unknown,
    };
  }, [places]);

  const updateFilters = useCallback((newFilters: PlaceFilters) => {
    setFilters(newFilters);
  }, []);

  // Refetch places (useful after contribution is approved)
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/places?page_size=100`);
      if (response.ok) {
        const data = await response.json();
        setPlaces(data.items || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    places,
    filteredPlaces,
    categories,
    filters,
    updateFilters,
    loading,
    error,
    stats,
    refetch,
  };
}
