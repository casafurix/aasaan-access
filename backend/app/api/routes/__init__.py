from fastapi import APIRouter

from app.api.routes.places import router as places_router
from app.api.routes.contributions import router as contributions_router
from app.api.routes.health import router as health_router

api_router = APIRouter()

api_router.include_router(health_router, tags=["health"])
api_router.include_router(places_router, prefix="/places", tags=["places"])
api_router.include_router(contributions_router, prefix="/contributions", tags=["contributions"])

