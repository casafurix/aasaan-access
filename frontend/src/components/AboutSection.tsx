import { Card, CardContent } from '@/components/ui/card';
import { Heart, Target, Eye, Users } from 'lucide-react';

export function AboutSection() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'Make accessibility information for places in India easy to find, use, and share. Because everyone deserves to know if a place is accessible before they visit.',
    },
    {
      icon: Eye,
      title: 'Open & Transparent',
      description: 'All data is public and free to use. We believe accessibility information should never be locked behind paywalls or proprietary systems.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by and for the disability community. We welcome contributions from anyone who wants to help make India more accessible.',
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-sm font-medium text-destructive mb-6">
            <Heart className="w-4 h-4" />
            Built with love
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About आसान Access
          </h2>
          <p className="text-lg text-muted-foreground">
            "आसान" means "easy" in Hindi. We're making it easy for disabled people
            and their families to find accessible places across India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {values.map(value => (
            <Card key={value.title} className="group">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accessibility Note */}
        <div className="max-w-2xl mx-auto mt-12 p-6 rounded-xl border border-border bg-card text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Accessibility commitment:</strong> This website is designed
            to be accessible to screen readers and keyboard navigation. If you encounter any issues,
            please let us know through our contribution form.
          </p>
        </div>
      </div>
    </section>
  );
}
