import { Button } from '@/components/ui/button';
import { ArrowDown, MapPin, Users, Database } from 'lucide-react';

interface HeroProps {
  totalPlaces: number;
  accessiblePlaces: number;
}

export function Hero({ totalPlaces, accessiblePlaces }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Pilot: Mumbai, Maharashtra
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in animation-delay-100">
            Making India{' '}
            <span className="gradient-text">आसान</span>
            <br />
            for Everyone
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-200">
            Discover accessible places across India. Open data for{' '}
            <strong className="text-foreground">wheelchair users</strong>,{' '}
            <strong className="text-foreground">visually impaired</strong>, and{' '}
            <strong className="text-foreground">everyone</strong> who needs accessibility information.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-4 animate-fade-in animation-delay-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">{totalPlaces}</p>
                <p className="text-sm text-muted-foreground">Places mapped</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-accessible/10">
                <Users className="w-5 h-5 text-status-accessible" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">{accessiblePlaces}</p>
                <p className="text-sm text-muted-foreground">Fully accessible</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-secondary/10">
                <Database className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Open data</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in animation-delay-500">
            <Button
              size="lg"
              asChild
              className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <a href="#map">
                <MapPin className="w-5 h-5" />
                Explore the Map
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <a href="#contribute">
                Help Add Data
              </a>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="pt-8 animate-fade-in animation-delay-500">
            <a
              href="#map"
              className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-sm">Scroll to explore</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
