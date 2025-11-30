import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, ClipboardList, CheckCircle, Upload, Users } from 'lucide-react';

const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_FORM_ID';

export function ContributeSection() {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Fill the Form',
      description: 'Answer simple questions about accessibility features you observed at a place.',
    },
    {
      icon: CheckCircle,
      title: 'We Review',
      description: 'Our team reviews submissions for accuracy before adding to the dataset.',
    },
    {
      icon: Upload,
      title: 'Data Updated',
      description: 'Approved submissions are added to the public dataset and map.',
    },
  ];

  return (
    <section id="contribute" className="py-16 md:py-24">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-sm font-medium text-secondary mb-6">
            <Users className="w-4 h-4" />
            Community Powered
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Help Map Accessibility
          </h2>
          <p className="text-lg text-muted-foreground">
            Your observations help disabled people navigate India with confidence.
            No login required—just share what you know.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line between cards */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-border" />
              )}
              <Card className="text-center h-full relative z-10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto -mt-4 border-4 border-card">
                  <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                </div>
              </CardHeader>
              <CardContent className="-mt-2">
                <CardTitle className="text-lg mb-2">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
            </div>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Ready to Contribute?
            </h3>
            <p className="text-muted-foreground mb-6">
              It takes less than 2 minutes to submit accessibility information for a place you've visited.
            </p>
            <Button
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
              asChild
            >
              <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5" />
                Open Contribution Form
              </a>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Opens Google Forms in a new tab • No login required
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
