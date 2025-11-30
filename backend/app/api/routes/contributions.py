from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import select, func
from uuid import UUID
from typing import Optional

from app.api.deps import DbSession, PaginationParams
from app.models.place import (
    Contribution,
    Place,
    ContributionStatus as DBContributionStatus,
)
from app.schemas.place import (
    ContributionCreate,
    ContributionResponse,
    ContributionReview,
    ContributionStatus,
    PlaceResponse,
)

router = APIRouter()


@router.post("", response_model=ContributionResponse, status_code=201)
async def submit_contribution(data: ContributionCreate, db: DbSession):
    """
    Submit a new contribution (public endpoint).
    Anyone can submit accessibility data for review.
    """
    contribution = Contribution(
        place_id=data.place_id,
        contributor_name=data.contributor_name,
        contributor_email=data.contributor_email,
        name=data.name,
        name_local=data.name_local,
        category=data.category,
        address=data.address,
        latitude=data.latitude,
        longitude=data.longitude,
        ramp_present=data.ramp_present,
        step_free_entrance=data.step_free_entrance,
        accessible_restroom=data.accessible_restroom,
        tactile_paving=data.tactile_paving,
        audio_signage=data.audio_signage,
        braille_signage=data.braille_signage,
        lighting_level=data.lighting_level,
        noise_level=data.noise_level,
        staff_assistance_available=data.staff_assistance_available,
        notes=data.notes,
    )
    
    db.add(contribution)
    await db.commit()
    await db.refresh(contribution)
    
    return contribution


@router.get("", response_model=list[ContributionResponse])
async def list_contributions(
    db: DbSession,
    pagination: PaginationParams,
    status: Optional[ContributionStatus] = Query(None),
):
    """
    List contributions (admin endpoint).
    """
    offset, limit, page = pagination
    
    query = select(Contribution).order_by(Contribution.created_at.desc())
    
    if status:
        query = query.where(Contribution.status == DBContributionStatus(status.value))
    
    query = query.offset(offset).limit(limit)
    
    result = await db.execute(query)
    contributions = result.scalars().all()
    
    return contributions


@router.get("/pending/count")
async def get_pending_count(db: DbSession):
    """
    Get count of pending contributions.
    """
    result = await db.execute(
        select(func.count(Contribution.id))
        .where(Contribution.status == DBContributionStatus.PENDING)
    )
    count = result.scalar()
    return {"pending_count": count}


@router.get("/{contribution_id}", response_model=ContributionResponse)
async def get_contribution(contribution_id: UUID, db: DbSession):
    """
    Get a single contribution by ID.
    """
    result = await db.execute(
        select(Contribution).where(Contribution.id == contribution_id)
    )
    contribution = result.scalar_one_or_none()
    
    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")
    
    return contribution


@router.post("/{contribution_id}/approve", response_model=PlaceResponse)
async def approve_contribution(
    contribution_id: UUID,
    db: DbSession,
    review: Optional[ContributionReview] = None,
):
    """
    Approve a contribution and create/update the place.
    """
    result = await db.execute(
        select(Contribution).where(Contribution.id == contribution_id)
    )
    contribution = result.scalar_one_or_none()
    
    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")
    
    if contribution.status != DBContributionStatus.PENDING:
        raise HTTPException(status_code=400, detail="Contribution already reviewed")
    
    # Create or update place
    if contribution.place_id:
        # Update existing place
        place_result = await db.execute(
            select(Place).where(Place.id == contribution.place_id)
        )
        place = place_result.scalar_one_or_none()
        
        if not place:
            raise HTTPException(status_code=404, detail="Original place not found")
        
        # Update place fields
        place.name = contribution.name
        place.name_local = contribution.name_local
        place.category = contribution.category
        place.address = contribution.address
        place.latitude = contribution.latitude
        place.longitude = contribution.longitude
        place.location = f"SRID=4326;POINT({contribution.longitude} {contribution.latitude})"
        place.ramp_present = contribution.ramp_present
        place.step_free_entrance = contribution.step_free_entrance
        place.accessible_restroom = contribution.accessible_restroom
        place.tactile_paving = contribution.tactile_paving
        place.audio_signage = contribution.audio_signage
        place.braille_signage = contribution.braille_signage
        place.lighting_level = contribution.lighting_level
        place.noise_level = contribution.noise_level
        place.staff_assistance_available = contribution.staff_assistance_available
        place.notes = contribution.notes
        # Recalculate accessibility status
        place.accessibility_status = calculate_accessibility_status(contribution)
        
    else:
        # Create new place
        place = Place(
            name=contribution.name,
            name_local=contribution.name_local,
            category=contribution.category,
            address=contribution.address,
            latitude=contribution.latitude,
            longitude=contribution.longitude,
            location=f"SRID=4326;POINT({contribution.longitude} {contribution.latitude})",
            ramp_present=contribution.ramp_present,
            step_free_entrance=contribution.step_free_entrance,
            accessible_restroom=contribution.accessible_restroom,
            tactile_paving=contribution.tactile_paving,
            audio_signage=contribution.audio_signage,
            braille_signage=contribution.braille_signage,
            lighting_level=contribution.lighting_level,
            noise_level=contribution.noise_level,
            staff_assistance_available=contribution.staff_assistance_available,
            notes=contribution.notes,
            accessibility_status=calculate_accessibility_status(contribution),
            source="user",
        )
        db.add(place)
    
    # Update contribution status
    contribution.status = DBContributionStatus.APPROVED
    if review and review.reviewer_notes:
        contribution.reviewer_notes = review.reviewer_notes
    
    from datetime import datetime, timezone
    contribution.reviewed_at = datetime.now(timezone.utc)
    
    await db.commit()
    await db.refresh(place)
    
    return place


@router.post("/{contribution_id}/reject", response_model=ContributionResponse)
async def reject_contribution(
    contribution_id: UUID,
    review: ContributionReview,
    db: DbSession,
):
    """
    Reject a contribution.
    """
    result = await db.execute(
        select(Contribution).where(Contribution.id == contribution_id)
    )
    contribution = result.scalar_one_or_none()
    
    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")
    
    if contribution.status != DBContributionStatus.PENDING:
        raise HTTPException(status_code=400, detail="Contribution already reviewed")
    
    contribution.status = DBContributionStatus.REJECTED
    contribution.reviewer_notes = review.reviewer_notes
    
    from datetime import datetime, timezone
    contribution.reviewed_at = datetime.now(timezone.utc)
    
    await db.commit()
    await db.refresh(contribution)
    
    return contribution


def calculate_accessibility_status(contribution: Contribution):
    """
    Calculate accessibility status based on attributes.
    """
    from app.models.place import AccessibilityStatus, RestroomAccessibility
    
    # Count positive accessibility features
    score = 0
    max_score = 6
    
    if contribution.ramp_present:
        score += 1
    if contribution.step_free_entrance:
        score += 1
    if contribution.accessible_restroom in [RestroomAccessibility.partial, RestroomAccessibility.full]:
        score += 1
    if contribution.tactile_paving:
        score += 1
    if contribution.audio_signage or contribution.braille_signage:
        score += 1
    if contribution.staff_assistance_available:
        score += 1
    
    # Determine status based on score
    ratio = score / max_score
    
    if ratio >= 0.7:
        return AccessibilityStatus.accessible
    elif ratio >= 0.3:
        return AccessibilityStatus.partially_accessible
    elif score > 0:
        return AccessibilityStatus.not_accessible
    else:
        return AccessibilityStatus.unknown

