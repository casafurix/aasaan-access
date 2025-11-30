"""
Seed database with initial places data from JSON file.

Usage:
    python -m scripts.seed_data
    
    Or with docker:
    docker-compose exec backend python -m scripts.seed_data
"""
import asyncio
import json
from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select
from app.database import AsyncSessionLocal, engine, Base
from app.models.place import (
    Place,
    AccessibilityStatus,
    RestroomAccessibility,
    LevelSetting,
    DataSource,
)


# Path to the JSON data file (in Docker: /app/seed_data/places.json, locally: ../frontend/public/data/places.json)
DATA_FILE = Path("/app/seed_data/places.json")
if not DATA_FILE.exists():
    # Fallback for local development
    DATA_FILE = Path(__file__).parent.parent.parent / "frontend" / "public" / "data" / "places.json"


def map_accessibility_status(status: str) -> AccessibilityStatus:
    mapping = {
        "accessible": AccessibilityStatus.accessible,
        "partially_accessible": AccessibilityStatus.partially_accessible,
        "not_accessible": AccessibilityStatus.not_accessible,
        "unknown": AccessibilityStatus.unknown,
    }
    return mapping.get(status, AccessibilityStatus.unknown)


def map_restroom(value: str) -> RestroomAccessibility:
    mapping = {
        "none": RestroomAccessibility.none,
        "partial": RestroomAccessibility.partial,
        "full": RestroomAccessibility.full,
    }
    return mapping.get(value, RestroomAccessibility.none)


def map_level(value: str) -> LevelSetting:
    mapping = {
        "low": LevelSetting.low,
        "medium": LevelSetting.medium,
        "high": LevelSetting.high,
    }
    return mapping.get(value, LevelSetting.medium)


def map_source(value: str) -> DataSource:
    mapping = {
        "user": DataSource.user,
        "manual": DataSource.manual,
        "osm": DataSource.osm,
    }
    return mapping.get(value, DataSource.user)


async def seed_places():
    """Load places from JSON and insert into database."""
    
    print(f"📂 Loading data from {DATA_FILE}")
    
    if not DATA_FILE.exists():
        print(f"❌ Data file not found: {DATA_FILE}")
        return
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        places_data = json.load(f)
    
    print(f"📊 Found {len(places_data)} places to import")
    
    async with AsyncSessionLocal() as session:
        # Check for existing places
        result = await session.execute(select(Place.legacy_id))
        existing_ids = {row[0] for row in result if row[0]}
        
        imported = 0
        skipped = 0
        
        for place_data in places_data:
            legacy_id = place_data.get("id")
            
            # Skip if already exists
            if legacy_id in existing_ids:
                skipped += 1
                continue
            
            # Create geometry point
            lat = place_data["latitude"]
            lng = place_data["longitude"]
            location = f"SRID=4326;POINT({lng} {lat})"
            
            place = Place(
                legacy_id=legacy_id,
                name=place_data["name"],
                name_local=place_data.get("name_local"),
                category=place_data["category"],
                address=place_data.get("address"),
                latitude=lat,
                longitude=lng,
                location=location,
                ramp_present=place_data.get("ramp_present", False),
                step_free_entrance=place_data.get("step_free_entrance", False),
                accessible_restroom=map_restroom(place_data.get("accessible_restroom", "none")),
                tactile_paving=place_data.get("tactile_paving", False),
                audio_signage=place_data.get("audio_signage", False),
                braille_signage=place_data.get("braille_signage", False),
                lighting_level=map_level(place_data.get("lighting_level", "medium")),
                noise_level=map_level(place_data.get("noise_level", "medium")),
                staff_assistance_available=place_data.get("staff_assistance_available", False),
                notes=place_data.get("notes"),
                photo_url=place_data.get("photo_url"),
                accessibility_status=map_accessibility_status(place_data.get("accessibility_status", "unknown")),
                source=map_source(place_data.get("source", "manual")),
            )
            
            session.add(place)
            imported += 1
        
        await session.commit()
        
        print(f"✅ Imported {imported} places")
        print(f"⏭️  Skipped {skipped} existing places")


async def main():
    print("🌱 Starting database seed...")
    print("-" * 40)
    
    await seed_places()
    
    print("-" * 40)
    print("🎉 Seeding complete!")


if __name__ == "__main__":
    asyncio.run(main())

