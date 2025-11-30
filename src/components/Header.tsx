import { Button } from '@/components/ui/button';
import { Download, Github, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDownload = (format: 'json' | 'csv' | 'geojson') => {
    const urls = {
      json: '/data/places.json',
      csv: '/data/places.csv',
      geojson: '/data/places.geojson',
    };
    window.open(urls[format], '_blank');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-xl">♿</span>
            </div>
            <span className="absolute -top-1 -right-1 text-lg">🇮🇳</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-foreground">
              आसान <span className="text-primary">Access</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Accessibility mapping for India
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <a
            href="#map"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Map
          </a>
          <a
            href="#about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#data"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Open Data
          </a>
          <a
            href="#contribute"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contribute
          </a>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload('json')}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Download</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden border-t border-border bg-background overflow-hidden transition-all duration-300',
          isMobileMenuOpen ? 'max-h-64' : 'max-h-0'
        )}
      >
        <nav className="container px-4 py-4 space-y-3">
          <a
            href="#map"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Map
          </a>
          <a
            href="#about"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#data"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Open Data
          </a>
          <a
            href="#contribute"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contribute
          </a>
          <div className="pt-3 border-t border-border flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload('json')}
              className="gap-2 flex-1"
            >
              <Download className="w-4 h-4" />
              Download Data
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
