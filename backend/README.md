# आसान Access - Backend API

Production-grade FastAPI backend with PostgreSQL + PostGIS.

## Tech Stack

- **Framework**: FastAPI (Python 3.12)
- **Database**: PostgreSQL 16 with PostGIS 3.4
- **ORM**: SQLAlchemy 2.0 (async)
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Containerization**: Docker

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application
│   ├── config.py         # Settings management
│   ├── database.py       # Database connection
│   ├── models/           # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── place.py
│   ├── schemas/          # Pydantic schemas
│   │   ├── __init__.py
│   │   └── place.py
│   └── api/
│       ├── __init__.py
│       ├── deps.py       # Dependencies
│       └── routes/
│           ├── __init__.py
│           ├── health.py
│           ├── places.py
│           └── contributions.py
├── alembic/              # Database migrations
├── scripts/
│   ├── seed_data.py      # Data seeding script
│   └── run_migrations.py
├── requirements.txt
├── Dockerfile
└── README.md
```

## API Endpoints

### Health
- `GET /api/health` - Health check
- `GET /api/health/db` - Database health check

### Places
- `GET /api/places` - List places (with filtering & pagination)
- `GET /api/places/{id}` - Get single place
- `GET /api/places/nearby` - Find nearby places (geospatial)
- `GET /api/places/stats` - Get statistics
- `GET /api/places/categories` - List all categories
- `POST /api/places` - Create place (admin)
- `PATCH /api/places/{id}` - Update place (admin)
- `DELETE /api/places/{id}` - Delete place (admin)

### Contributions
- `POST /api/contributions` - Submit contribution (public)
- `GET /api/contributions` - List contributions (admin)
- `GET /api/contributions/pending/count` - Pending count
- `POST /api/contributions/{id}/approve` - Approve (admin)
- `POST /api/contributions/{id}/reject` - Reject (admin)

## Local Development

### With Docker (Recommended)

```bash
# From project root
make dev

# Run migrations
make migrate

# Seed data
make seed
```

### Without Docker

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/aasaan_access
export SYNC_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aasaan_access

# Run migrations
alembic upgrade head

# Seed data
python -m scripts.seed_data

# Start server
uvicorn app.main:app --reload
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Async PostgreSQL URL | `postgresql+asyncpg://postgres:postgres@localhost:5432/aasaan_access` |
| `SYNC_DATABASE_URL` | Sync PostgreSQL URL (for migrations) | `postgresql://postgres:postgres@localhost:5432/aasaan_access` |
| `APP_ENV` | Environment (development/production) | `development` |
| `DEBUG` | Enable debug mode | `true` |
| `SECRET_KEY` | Secret key for security | `change-in-production` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |

## API Documentation

When running, access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

