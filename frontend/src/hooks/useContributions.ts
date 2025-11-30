import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface ContributionData {
  name: string;
  name_local?: string;
  category: string;
  address?: string;
  latitude: number;
  longitude: number;
  ramp_present?: boolean;
  step_free_entrance?: boolean;
  accessible_restroom?: 'none' | 'partial' | 'full';
  tactile_paving?: boolean;
  audio_signage?: boolean;
  braille_signage?: boolean;
  lighting_level?: 'low' | 'medium' | 'high';
  noise_level?: 'low' | 'medium' | 'high';
  staff_assistance_available?: boolean;
  notes?: string;
  contributor_name?: string;
  contributor_email?: string;
  place_id?: string; // For editing existing place
}

export function useContributions() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitContribution = async (data: ContributionData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to submit contribution');
      }

      setSuccess(true);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    submitContribution,
    submitting,
    error,
    success,
    reset,
  };
}

