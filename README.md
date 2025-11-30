# 🇮🇳 आसान Access - Accessibility Mapping for India

**आसान (Aasan)** means "easy" in Hindi. This project makes accessibility information for places in India easy to find, use, and share.

## 🎯 Project Overview

आसान Access is an open-data platform that shows how accessible everyday places are across India for disabled people. It provides:

- 🗺️ **Interactive Map** - Leaflet.js map with color-coded accessibility markers
- 📊 **Open Data** - Public CSV, JSON, and GeoJSON datasets
- 🤝 **Community Contributions** - Google Forms-based data collection
- 🌐 **Free API** - Static endpoints for developers

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Data Structure

### Places Dataset

Each place contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `poi_001`) |
| `name` | string | Place name in English |
| `name_local` | string | Place name in local script (Hindi/Marathi) |
| `category` | string | Type of place (hospital, station, etc.) |
| `latitude` | number | GPS latitude |
| `longitude` | number | GPS longitude |
| `address` | string | Full address |

### Accessibility Attributes

| Field | Type | Values |
|-------|------|--------|
| `ramp_present` | boolean | true/false |
| `step_free_entrance` | boolean | true/false |
| `accessible_restroom` | enum | `none`, `partial`, `full` |
| `tactile_paving` | boolean | true/false |
| `audio_signage` | boolean | true/false |
| `braille_signage` | boolean | true/false |
| `lighting_level` | enum | `low`, `medium`, `high` |
| `noise_level` | enum | `low`, `medium`, `high` |
| `staff_assistance_available` | boolean | true/false |

### Derived Fields

| Field | Values | Description |
|-------|--------|-------------|
| `accessibility_status` | `accessible`, `partially_accessible`, `not_accessible`, `unknown` | Overall accessibility rating |
| `source` | `user`, `manual`, `osm` | Data source |
| `updated_at` | ISO timestamp | Last update time |

## 📥 Data Access / API

All data is available as static files:

```
GET /data/places.json      # Full dataset as JSON
GET /data/places.csv       # Full dataset as CSV
GET /data/places.geojson   # Full dataset as GeoJSON
```

### Example Usage

```javascript
// Fetch all places
const response = await fetch('/data/places.json');
const places = await response.json();

// Filter accessible places
const accessible = places.filter(p => p.accessibility_status === 'accessible');
```

## 🗺️ Map Legend

| Color | Status | Description |
|-------|--------|-------------|
| 🟢 Green | Accessible | Fully accessible for wheelchair users |
| 🟡 Yellow | Partially Accessible | Some accessibility features present |
| 🔴 Red | Not Accessible | Significant barriers present |
| ⚪ Grey | Unknown | No accessibility data yet |

## 🤝 Contributing Data

### Via Google Form

1. Visit a place and observe its accessibility features
2. Fill out the contribution form (linked on the website)
3. Our team reviews submissions
4. Approved data is added to the public dataset

### Data Refresh Workflow

1. **Google Form** → Responses land in Google Sheets
2. **Manual Review** → Mark submissions as approved/rejected
3. **Merge Script** → Run `scripts/merge-data.js` (coming soon)
4. **Deploy** → Updated data files are deployed automatically

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **Maps**: Leaflet.js + React-Leaflet
- **Data**: Static JSON/CSV/GeoJSON files
- **Hosting**: Static hosting (GitHub Pages / Netlify / Vercel)

## 📂 Project Structure

```
├── public/
│   └── data/
│       ├── places.json      # Main dataset (JSON)
│       ├── places.csv       # Main dataset (CSV)
│       └── places.geojson   # Main dataset (GeoJSON)
├── src/
│   ├── components/          # React components
│   │   ├── AccessibilityMap.tsx
│   │   ├── PlaceCard.tsx
│   │   ├── FilterPanel.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── usePlaces.ts     # Data fetching hook
│   ├── types/
│   │   └── place.ts         # TypeScript types
│   └── pages/
│       └── Index.tsx        # Main page
└── README.md
```

## 🔜 Roadmap

### Phase 1 (Current) ✅
- [x] Static map with Mumbai POIs
- [x] Public CSV/JSON/GeoJSON endpoints
- [x] Filter by accessibility features
- [x] Color-coded markers
- [x] Place detail cards

### Phase 2 (Planned)
- [ ] Google Forms integration
- [ ] OSM data import script
- [ ] More cities (Delhi, Bengaluru)
- [ ] Marker clustering for performance
- [ ] Search functionality

### Phase 3 (Future)
- [ ] User accounts (optional)
- [ ] Photo uploads
- [ ] Verified reviews
- [ ] Mobile app

## 📄 License

- **Code**: MIT License
- **Data**: [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/)

## 🙏 Acknowledgments

- Data sources: OpenStreetMap contributors, community members
- Built with love for the disability community in India 💚

---

*"आसान" means "easy" - because accessibility information should be easy to find for everyone.*
