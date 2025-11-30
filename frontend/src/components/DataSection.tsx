import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileJson, FileSpreadsheet, Map, ExternalLink, Code } from 'lucide-react';

export function DataSection() {
  const dataFormats = [
    {
      name: 'JSON',
      description: 'Full dataset with all attributes',
      icon: FileJson,
      url: '/data/places.json',
      color: 'text-amber-500',
    },
    {
      name: 'GeoJSON',
      description: 'For GIS applications and maps',
      icon: Map,
      url: '/data/places.geojson',
      color: 'text-emerald-500',
    },
    {
      name: 'CSV',
      description: 'Spreadsheet compatible format',
      icon: FileSpreadsheet,
      url: '/data/places.csv',
      color: 'text-blue-500',
    },
  ];

  return (
    <section id="data" className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Open Data for Everyone
          </h2>
          <p className="text-lg text-muted-foreground">
            All accessibility data is freely available under an open license.
            Download, use, and build upon this data to make India more accessible.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {dataFormats.map(format => (
            <Card key={format.name} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${format.color}`}>
                  <format.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{format.name}</CardTitle>
                <CardDescription>{format.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  asChild
                >
                  <a href={format.url} download>
                    <Download className="w-4 h-4" />
                    Download {format.name}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Info */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Direct access via static endpoints</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div className="space-y-2">
                <p className="text-muted-foreground"># Get all places as JSON</p>
                <p className="text-foreground">GET /data/places.json</p>
                <p className="text-muted-foreground mt-4"># Get all places as GeoJSON</p>
                <p className="text-foreground">GET /data/places.geojson</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              These are static endpoints served directly from this website.
              No API key required. Rate limiting: none.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
