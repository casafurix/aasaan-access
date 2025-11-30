# 🇮🇳 आसान Access - Accessibility Mapping for India

**आसान (Aasan)** means "easy" in Hindi. This project makes accessibility information for places in India easy to find, use, and share.

## 🎯 Project Overview

आसान Access is an open-data platform that shows how accessible everyday places are across India for disabled people. It provides:

- 🗺️ **Interactive Map** - Leaflet.js map with color-coded accessibility markers
- 📊 **Open Data** - Public API and downloadable datasets
- 🤝 **Community Contributions** - Submit accessibility data via in-app form
- 🌐 **REST API** - Full CRUD API with geospatial search (nearby places)

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for frontend development)
- Make (optional, for convenience commands)

### One-Command Setup

```bash
# Start everything with Docker
make init

# Or manually:
docker-compose up -d
docker-compose exec backend alembic upgrade head
docker-compose exec backend python -m scripts.seed_data
```

This will start:

- **PostgreSQL + PostGIS** on port 5432
- **Backend API** on http://localhost:8000
- **Frontend** on http://localhost:3000 (production) or run `cd frontend && npm run dev` for dev on 5173

### Development Mode

```bash
# Start DB + Backend with hot reload
make dev

# In another terminal, start frontend
cd frontend && npm install && npm run dev
```

## 🏗️ Tech Stack

| Layer                | Technology                   |
| -------------------- | ---------------------------- |
| **Frontend**         | React 19 + TypeScript + Vite |
| **UI**               | Tailwind CSS + Shadcn/UI     |
| **Maps**             | Leaflet.js                   |
| **Backend**          | FastAPI (Python 3.12)        |
| **Database**         | PostgreSQL 16 + PostGIS 3.4  |
| **ORM**              | SQLAlchemy 2.0 (async)       |
| **Containerization** | Docker + Docker Compose      |

## 📂 Project Structure

```
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── pages/          # Page components
│   ├── public/data/        # Static data files
│   ├── Dockerfile
│   └── package.json
│
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/routes/     # API endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── main.py         # FastAPI app
│   │   └── config.py       # Settings
│   ├── alembic/            # DB migrations
│   ├── scripts/            # Utility scripts
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml       # Production config
├── docker-compose.dev.yml   # Development overrides
└── Makefile                 # Convenience commands
```

## 🔌 API Endpoints

### Places

| Method | Endpoint                                  | Description                         |
| ------ | ----------------------------------------- | ----------------------------------- |
| GET    | `/api/places`                             | List places (filterable, paginated) |
| GET    | `/api/places/{id}`                        | Get single place                    |
| GET    | `/api/places/nearby?lat=&lng=&radius_km=` | Geospatial search                   |
| GET    | `/api/places/stats`                       | Get statistics                      |
| GET    | `/api/places/categories`                  | List categories                     |
| POST   | `/api/places`                             | Create place                        |
| PATCH  | `/api/places/{id}`                        | Update place                        |
| DELETE | `/api/places/{id}`                        | Delete place                        |

### Contributions

| Method | Endpoint                          | Description             |
| ------ | --------------------------------- | ----------------------- |
| POST   | `/api/contributions`              | Submit new contribution |
| GET    | `/api/contributions`              | List all (admin)        |
| GET    | `/api/contributions/pending`      | List pending (admin)    |
| POST   | `/api/contributions/{id}/approve` | Approve & create/update |
| POST   | `/api/contributions/{id}/reject`  | Reject with reason      |

### Health

| Method | Endpoint      | Description  |
| ------ | ------------- | ------------ |
| GET    | `/api/health` | Health check |

### Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📁 Data Structure

### Places Dataset

| Field        | Type   | Description                |
| ------------ | ------ | -------------------------- |
| `id`         | UUID   | Unique identifier          |
| `name`       | string | Place name in English      |
| `name_local` | string | Place name in local script |
| `category`   | string | Type of place              |
| `latitude`   | number | GPS latitude               |
| `longitude`  | number | GPS longitude              |
| `address`    | string | Full address               |

### Accessibility Attributes

| Field                        | Type    | Values                    |
| ---------------------------- | ------- | ------------------------- |
| `ramp_present`               | boolean | true/false                |
| `step_free_entrance`         | boolean | true/false                |
| `accessible_restroom`        | enum    | `none`, `partial`, `full` |
| `tactile_paving`             | boolean | true/false                |
| `audio_signage`              | boolean | true/false                |
| `braille_signage`            | boolean | true/false                |
| `lighting_level`             | enum    | `low`, `medium`, `high`   |
| `noise_level`                | enum    | `low`, `medium`, `high`   |
| `staff_assistance_available` | boolean | true/false                |

### Derived Fields

| Field                  | Values                                                            | Description      |
| ---------------------- | ----------------------------------------------------------------- | ---------------- |
| `accessibility_status` | `accessible`, `partially_accessible`, `not_accessible`, `unknown` | Overall rating   |
| `source`               | `user`, `manual`, `osm`                                           | Data source      |
| `updated_at`           | ISO timestamp                                                     | Last update time |

## 🤝 Contributing Data

### How to Contribute

1. **Add a Place** - Click "Add a Place" in the Contribute section to submit a new location
2. **Suggest an Edit** - Click "Suggest an Edit" on any place card to update existing information

All submissions go through a moderation queue before being published.

### Moderation Flow

1. User submits contribution → Status: `pending`
2. Admin reviews at `/api/contributions/pending`
3. Admin approves → Place created/updated, Status: `approved`
4. Or admin rejects with reason → Status: `rejected`

> ⚠️ **Note**: Admin endpoints (`/approve`, `/reject`) currently have no authentication. Add auth before production deployment.

## 🗺️ Map Legend

| Color     | Status               | Description                           |
| --------- | -------------------- | ------------------------------------- |
| 🟢 Green  | Accessible           | Fully accessible for wheelchair users |
| 🟡 Yellow | Partially Accessible | Some accessibility features present   |
| 🔴 Red    | Not Accessible       | Significant barriers present          |
| ⚪ Grey   | Unknown              | No accessibility data yet             |

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```bash
# Database connection
DB_HOST=db
DB_PORT=5432
DB_NAME=aasaan_access
DB_USER=postgres
DB_PASSWORD=postgres

# App settings
DEBUG=true
```

### Frontend (`frontend/.env`)

```bash
# API URL (optional - defaults to /api which proxies to backend)
VITE_API_URL=http://localhost:8000/api
```

> In Docker, the frontend Nginx config proxies `/api` requests to the backend container.

## 🛠️ Make Commands

```bash
make help          # Show all commands
make dev           # Start development environment
make prod          # Start production environment
make down          # Stop all services
make logs          # View logs
make migrate       # Run database migrations
make seed          # Seed database with initial data
make db-shell      # Open PostgreSQL shell
make clean         # Remove all containers and volumes
```

## 🔜 Roadmap

### Phase 1 ✅

- [x] Static map with Mumbai POIs
- [x] Filter by accessibility features
- [x] Color-coded markers
- [x] Place detail cards

### Phase 2 ✅

- [x] FastAPI backend with PostgreSQL + PostGIS
- [x] REST API with CRUD operations
- [x] Geospatial search (nearby places)
- [x] In-app contribution form (add & edit places)
- [x] Contribution moderation queue (approve/reject)
- [x] Docker containerization (full stack)
- [x] API fallback to static data

### Phase 3 (Planned)

- [ ] Admin authentication for moderation endpoints
- [ ] Rate limiting & spam protection
- [ ] Photo uploads (S3/Cloudinary)
- [ ] Server-side filtering (offload from client)
- [ ] OSM data import pipeline
- [ ] More cities (Delhi, Bengaluru, Chennai)
- [ ] Mobile app (React Native / PWA)

## 📄 License

- **Code**: MIT License
- **Data**: [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/)

## 🙏 Acknowledgments

- Data sources: OpenStreetMap contributors, community members
- Built with love for the disability community in India 💚

---

_"आसान" means "easy" - because accessibility information should be easy to find for everyone._
