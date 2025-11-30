from pydantic import BaseModel, Field, EmailStr, ConfigDict
from datetime import datetime
from uuid import UUID
from enum import Enum
from typing import Optional


class AccessibilityStatus(str, Enum):
    accessible = "accessible"
    partially_accessible = "partially_accessible"
    not_accessible = "not_accessible"
    unknown = "unknown"


class RestroomAccessibility(str, Enum):
    none = "none"
    partial = "partial"
    full = "full"


class LevelSetting(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class DataSource(str, Enum):
    user = "user"
    manual = "manual"
    osm = "osm"


class ContributionStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


# Base schema for Place
class PlaceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    name_local: Optional[str] = Field(None, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    address: Optional[str] = None
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    
    # Accessibility attributes
    ramp_present: bool = False
    step_free_entrance: bool = False
    accessible_restroom: RestroomAccessibility = RestroomAccessibility.none
    tactile_paving: bool = False
    audio_signage: bool = False
    braille_signage: bool = False
    lighting_level: LevelSetting = LevelSetting.medium
    noise_level: LevelSetting = LevelSetting.medium
    staff_assistance_available: bool = False
    notes: Optional[str] = None


class PlaceCreate(PlaceBase):
    accessibility_status: AccessibilityStatus = AccessibilityStatus.unknown
    source: DataSource = DataSource.manual
    photo_url: Optional[str] = None


class PlaceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    name_local: Optional[str] = Field(None, max_length=255)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    address: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    
    ramp_present: Optional[bool] = None
    step_free_entrance: Optional[bool] = None
    accessible_restroom: Optional[RestroomAccessibility] = None
    tactile_paving: Optional[bool] = None
    audio_signage: Optional[bool] = None
    braille_signage: Optional[bool] = None
    lighting_level: Optional[LevelSetting] = None
    noise_level: Optional[LevelSetting] = None
    staff_assistance_available: Optional[bool] = None
    notes: Optional[str] = None
    photo_url: Optional[str] = None
    accessibility_status: Optional[AccessibilityStatus] = None
    source: Optional[DataSource] = None


class PlaceResponse(PlaceBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    legacy_id: Optional[str] = None
    photo_url: Optional[str] = None
    accessibility_status: AccessibilityStatus
    source: DataSource
    created_at: datetime
    updated_at: datetime


class PlaceListResponse(BaseModel):
    items: list[PlaceResponse]
    total: int
    page: int
    page_size: int
    pages: int


class PlaceFilters(BaseModel):
    """Query filters for places"""
    category: Optional[list[str]] = None
    accessibility_status: Optional[list[AccessibilityStatus]] = None
    ramp_present: Optional[bool] = None
    step_free_entrance: Optional[bool] = None
    accessible_restroom: Optional[list[RestroomAccessibility]] = None
    tactile_paving: Optional[bool] = None
    audio_signage: Optional[bool] = None
    braille_signage: Optional[bool] = None
    staff_assistance_available: Optional[bool] = None
    source: Optional[list[DataSource]] = None


class NearbySearchParams(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    radius_km: float = Field(5.0, gt=0, le=50, description="Search radius in kilometers")


# Contribution schemas
class ContributionCreate(PlaceBase):
    """Schema for public contribution submissions"""
    contributor_name: Optional[str] = Field(None, max_length=255)
    contributor_email: Optional[EmailStr] = None
    place_id: Optional[UUID] = None  # If editing existing place


class ContributionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    place_id: Optional[UUID] = None
    contributor_name: Optional[str] = None
    name: str
    category: str
    status: ContributionStatus
    created_at: datetime
    reviewed_at: Optional[datetime] = None


class ContributionReview(BaseModel):
    """Schema for moderator review"""
    status: ContributionStatus
    reviewer_notes: Optional[str] = None


class StatsResponse(BaseModel):
    total: int
    accessible: int
    partially_accessible: int
    not_accessible: int
    unknown: int
    by_category: dict[str, int]

