from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import load_only
from geoalchemy2.functions import ST_DWithin, ST_MakePoint, ST_SetSRID, ST_Distance
from uuid import UUID
from typing import Optional

from app.api.deps import DbSession, PaginationParams
from app.models.place import Place, AccessibilityStatus as DBAccessibilityStatus
from app.schemas.place import (
    PlaceCreate,
    PlaceUpdate,
    PlaceResponse,
    PlaceListResponse,
    PlaceFilters,
    NearbySearchParams,
    StatsResponse,
    AccessibilityStatus,
)

router = APIRouter()


@router.get("", response_model=PlaceListResponse)
async def list_places(
    db: DbSession,
    pagination: PaginationParams,
    # Filter parameters
    category: Optional[list[str]] = Query(None),
    accessibility_status: Optional[list[AccessibilityStatus]] = Query(None),
    ramp_present: Optional[bool] = None,
    step_free_entrance: Optional[bool] = None,
    tactile_paving: Optional[bool] = None,
    audio_signage: Optional[bool] = None,
    braille_signage: Optional[bool] = None,
    staff_assistance_available: Optional[bool] = None,
    search: Optional[str] = Query(
        None, description="Search by name or address"),
):
    """
    List all places with optional filtering and pagination.
    """
    offset, limit, page = pagination

    # Build query
    query = select(Place)
    count_query = select(func.count(Place.id))

    # Apply filters
    conditions = []

    if category:
        conditions.append(Place.category.in_(category))

    if accessibility_status:
        db_statuses = [DBAccessibilityStatus(
            s.value) for s in accessibility_status]
        conditions.append(Place.accessibility_status.in_(db_statuses))

    if ramp_present is not None:
        conditions.append(Place.ramp_present == ramp_present)

    if step_free_entrance is not None:
        conditions.append(Place.step_free_entrance == step_free_entrance)

    if tactile_paving is not None:
        conditions.append(Place.tactile_paving == tactile_paving)

    if audio_signage is not None:
        conditions.append(Place.audio_signage == audio_signage)

    if braille_signage is not None:
        conditions.append(Place.braille_signage == braille_signage)

    if staff_assistance_available is not None:
        conditions.append(Place.staff_assistance_available ==
                          staff_assistance_available)

    if search:
        search_term = f"%{search}%"
        conditions.append(
            or_(
                Place.name.ilike(search_term),
                Place.name_local.ilike(search_term),
                Place.address.ilike(search_term)
            )
        )

    if conditions:
        query = query.where(and_(*conditions))
        count_query = count_query.where(and_(*conditions))

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Apply pagination and ordering
    query = query.order_by(Place.name).offset(offset).limit(limit)

    # Execute query
    result = await db.execute(query)
    places = result.scalars().all()

    # Calculate pages
    pages = (total + limit - 1) // limit if total > 0 else 0

    return PlaceListResponse(
        items=places,
        total=total,
        page=page,
        page_size=limit,
        pages=pages
    )


@router.get("/nearby", response_model=list[PlaceResponse])
async def find_nearby_places(
    db: DbSession,
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(5.0, gt=0, le=50, description="Radius in km"),
    limit: int = Query(20, ge=1, le=100),
    accessibility_status: Optional[list[AccessibilityStatus]] = Query(None),
):
    """
    Find places within a radius of a given point.
    Uses PostGIS for efficient geospatial queries.
    """
    # Convert km to meters for PostGIS
    radius_m = radius_km * 1000

    # Create point from coordinates
    point = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)

    # Build query with distance filter
    query = (
        select(Place)
        .where(ST_DWithin(Place.location, point, radius_m, use_spheroid=True))
        .order_by(ST_Distance(Place.location, point))
        .limit(limit)
    )

    # Apply accessibility filter if provided
    if accessibility_status:
        db_statuses = [DBAccessibilityStatus(
            s.value) for s in accessibility_status]
        query = query.where(Place.accessibility_status.in_(db_statuses))

    result = await db.execute(query)
    places = result.scalars().all()

    return places


@router.get("/stats", response_model=StatsResponse)
async def get_stats(db: DbSession):
    """
    Get aggregate statistics about places.
    """
    # Total count
    total_result = await db.execute(select(func.count(Place.id)))
    total = total_result.scalar()

    # Count by status
    status_query = select(
        Place.accessibility_status,
        func.count(Place.id)
    ).group_by(Place.accessibility_status)

    status_result = await db.execute(status_query)
    status_counts = {row[0].value: row[1] for row in status_result}

    # Count by category
    category_query = select(
        Place.category,
        func.count(Place.id)
    ).group_by(Place.category).order_by(func.count(Place.id).desc())

    category_result = await db.execute(category_query)
    category_counts = {row[0]: row[1] for row in category_result}

    return StatsResponse(
        total=total,
        accessible=status_counts.get("accessible", 0),
        partially_accessible=status_counts.get("partially_accessible", 0),
        not_accessible=status_counts.get("not_accessible", 0),
        unknown=status_counts.get("unknown", 0),
        by_category=category_counts
    )


@router.get("/categories", response_model=list[str])
async def get_categories(db: DbSession):
    """
    Get list of all unique categories.
    """
    query = select(Place.category).distinct().order_by(Place.category)
    result = await db.execute(query)
    categories = [row[0] for row in result]
    return categories


@router.get("/{place_id}", response_model=PlaceResponse)
async def get_place(place_id: UUID, db: DbSession):
    """
    Get a single place by ID.
    """
    result = await db.execute(select(Place).where(Place.id == place_id))
    place = result.scalar_one_or_none()

    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    return place


@router.post("", response_model=PlaceResponse, status_code=201)
async def create_place(place_data: PlaceCreate, db: DbSession):
    """
    Create a new place (admin endpoint).
    """
    # Create geometry point from coordinates
    location = f"SRID=4326;POINT({place_data.longitude} {place_data.latitude})"

    place = Place(
        **place_data.model_dump(),
        location=location
    )

    db.add(place)
    await db.commit()
    await db.refresh(place)

    return place


@router.patch("/{place_id}", response_model=PlaceResponse)
async def update_place(place_id: UUID, place_data: PlaceUpdate, db: DbSession):
    """
    Update an existing place (admin endpoint).
    """
    result = await db.execute(select(Place).where(Place.id == place_id))
    place = result.scalar_one_or_none()

    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    # Update only provided fields
    update_data = place_data.model_dump(exclude_unset=True)

    # Update location if coordinates changed
    if "latitude" in update_data or "longitude" in update_data:
        lat = update_data.get("latitude", place.latitude)
        lng = update_data.get("longitude", place.longitude)
        update_data["location"] = f"SRID=4326;POINT({lng} {lat})"

    for key, value in update_data.items():
        setattr(place, key, value)

    await db.commit()
    await db.refresh(place)

    return place


@router.delete("/{place_id}", status_code=204)
async def delete_place(place_id: UUID, db: DbSession):
    """
    Delete a place (admin endpoint).
    """
    result = await db.execute(select(Place).where(Place.id == place_id))
    place = result.scalar_one_or_none()

    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    await db.delete(place)
    await db.commit()

    return None
