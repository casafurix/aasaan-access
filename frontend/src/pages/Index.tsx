import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AccessibilityMap } from '@/components/AccessibilityMap';
import { PlaceCard } from '@/components/PlaceCard';
import { FilterPanel } from '@/components/FilterPanel';
import { Legend } from '@/components/Legend';
import { DataSection } from '@/components/DataSection';
import { ContributeSection } from '@/components/ContributeSection';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { usePlaces } from '@/hooks/usePlaces';
import { Place } from '@/types/place';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const {
    filteredPlaces,
    categories,
    filters,
    updateFilters,
    loading,
    error,
    stats,
  } = usePlaces();

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleClosePlaceCard = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          totalPlaces={stats.total}
          accessiblePlaces={stats.accessible}
        />

        {/* Map Section */}
        <section id="map" className="py-8 md:py-12">
          <div className="container px-4">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Accessibility Map
              </h2>
              <p className="text-muted-foreground">
                Click on any marker to see accessibility details
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96 bg-muted/30 rounded-xl">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading places...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96 bg-destructive/10 rounded-xl">
                <div className="text-center">
                  <p className="text-destructive font-medium">Error loading data</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1fr_380px] gap-6">
                {/* Map Container */}
                <div className="order-2 lg:order-1">
                  <div className="relative h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-lg border border-border">
                    <AccessibilityMap
                      places={filteredPlaces}
                      selectedPlace={selectedPlace}
                      onPlaceSelect={handlePlaceSelect}
                    />
                    
                    {/* Legend overlay */}
                    <div className="absolute bottom-4 left-4 z-[1000]">
                      <Legend />
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="order-1 lg:order-2 space-y-4">
                  {/* Filters */}
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={updateFilters}
                    categories={categories}
                    totalCount={stats.total}
                    filteredCount={filteredPlaces.length}
                  />

                  {/* Selected Place Card */}
                  {selectedPlace && (
                    <PlaceCard
                      place={selectedPlace}
                      onClose={handleClosePlaceCard}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Data Section */}
        <DataSection />

        {/* Contribute Section */}
        <ContributeSection />

        {/* About Section */}
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
