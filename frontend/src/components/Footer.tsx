import { Github, Heart, Mail, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl">♿</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  आसान Access
                </h3>
                <p className="text-xs text-muted-foreground">
                  Making India accessible
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              An open-source, community-driven project to map accessibility
              information for places across India. Free to use, free to contribute.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@aasanaccess.in"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#map" className="text-muted-foreground hover:text-foreground transition-colors">
                  Explore Map
                </a>
              </li>
              <li>
                <a href="#data" className="text-muted-foreground hover:text-foreground transition-colors">
                  Download Data
                </a>
              </li>
              <li>
                <a href="#contribute" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contribute
                </a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/data/places.json" className="text-muted-foreground hover:text-foreground transition-colors">
                  API (JSON)
                </a>
              </li>
              <li>
                <a href="/data/places.geojson" className="text-muted-foreground hover:text-foreground transition-colors">
                  GeoJSON
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub Repo
                </a>
              </li>
              <li>
                <a
                  href="https://openstreetmap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  OpenStreetMap
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} आसान Access. Data available under{' '}
            <a
              href="https://opendatacommons.org/licenses/odbl/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              ODbL
            </a>
            .
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
