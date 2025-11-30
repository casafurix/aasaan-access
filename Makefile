.PHONY: help dev prod down logs migrate seed backend-shell db-shell clean

# Default target
help:
	@echo "आसान Access - Development Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Docker Commands:"
	@echo "  dev          Start development environment (DB + Backend with hot reload)"
	@echo "  prod         Start production environment (all services)"
	@echo "  down         Stop all services"
	@echo "  logs         View logs from all services"
	@echo "  clean        Remove all containers, volumes, and images"
	@echo ""
	@echo "Database Commands:"
	@echo "  migrate      Run database migrations"
	@echo "  seed         Seed database with initial data"
	@echo "  db-shell     Open PostgreSQL shell"
	@echo ""
	@echo "Backend Commands:"
	@echo "  backend-shell  Open shell in backend container"
	@echo "  backend-logs   View backend logs"
	@echo ""
	@echo "Frontend Commands:"
	@echo "  frontend-dev   Start frontend dev server (run separately)"

# Development environment (DB + Backend only)
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d db backend
	@echo ""
	@echo "✅ Development environment started!"
	@echo "   Backend API: http://localhost:8000"
	@echo "   API Docs:    http://localhost:8000/docs"
	@echo "   Database:    localhost:5432"
	@echo ""
	@echo "Run 'cd frontend && npm run dev' to start the frontend"

# Production environment (all services)
prod:
	docker-compose up -d --build
	@echo ""
	@echo "✅ Production environment started!"
	@echo "   Frontend:    http://localhost:3000"
	@echo "   Backend API: http://localhost:8000"

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

backend-logs:
	docker-compose logs -f backend

# Run migrations
migrate:
	docker-compose exec backend alembic upgrade head

# Seed database
seed:
	docker-compose exec backend python -m scripts.seed_data

# Open PostgreSQL shell
db-shell:
	docker-compose exec db psql -U postgres -d aasaan_access

# Open backend shell
backend-shell:
	docker-compose exec backend /bin/sh

# Start frontend dev server (run in separate terminal)
frontend-dev:
	cd frontend && npm run dev

# Clean everything
clean:
	docker-compose down -v --rmi local
	@echo "✅ Cleaned up all containers, volumes, and images"

# Initialize project (first time setup)
init: dev
	@echo "⏳ Waiting for database to be ready..."
	@sleep 5
	$(MAKE) migrate
	$(MAKE) seed
	@echo ""
	@echo "🎉 Project initialized successfully!"

