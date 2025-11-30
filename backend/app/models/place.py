from sqlalchemy import (
    String, Boolean, Text, Enum, DateTime, Float, func, Index
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
from datetime import datetime
import uuid
import enum

from app.database import Base


class AccessibilityStatus(str, enum.Enum):
    accessible = "accessible"
    partially_accessible = "partially_accessible"
    not_accessible = "not_accessible"
    unknown = "unknown"


class RestroomAccessibility(str, enum.Enum):
    none = "none"
    partial = "partial"
    full = "full"


class LevelSetting(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class DataSource(str, enum.Enum):
    user = "user"
    manual = "manual"
    osm = "osm"


class ContributionStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Place(Base):
    __tablename__ = "places"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    legacy_id: Mapped[str | None] = mapped_column(String(50), unique=True, nullable=True)
    
    # Basic info
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    name_local: Mapped[str | None] = mapped_column(String(255), nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Location
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    location: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=False
    )
    
    # Accessibility attributes
    ramp_present: Mapped[bool] = mapped_column(Boolean, default=False)
    step_free_entrance: Mapped[bool] = mapped_column(Boolean, default=False)
    accessible_restroom: Mapped[RestroomAccessibility] = mapped_column(
        Enum(RestroomAccessibility), default=RestroomAccessibility.none
    )
    tactile_paving: Mapped[bool] = mapped_column(Boolean, default=False)
    audio_signage: Mapped[bool] = mapped_column(Boolean, default=False)
    braille_signage: Mapped[bool] = mapped_column(Boolean, default=False)
    lighting_level: Mapped[LevelSetting] = mapped_column(
        Enum(LevelSetting), default=LevelSetting.medium
    )
    noise_level: Mapped[LevelSetting] = mapped_column(
        Enum(LevelSetting), default=LevelSetting.medium
    )
    staff_assistance_available: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Metadata
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    accessibility_status: Mapped[AccessibilityStatus] = mapped_column(
        Enum(AccessibilityStatus), default=AccessibilityStatus.unknown, index=True
    )
    source: Mapped[DataSource] = mapped_column(
        Enum(DataSource), default=DataSource.user
    )
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (
        Index("idx_places_location", "location", postgresql_using="gist"),
        Index("idx_places_category_status", "category", "accessibility_status"),
    )

    def __repr__(self) -> str:
        return f"<Place {self.name} ({self.accessibility_status.value})>"


class Contribution(Base):
    """Pending contributions awaiting moderation"""
    __tablename__ = "contributions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    
    # Can be a new place or an edit to existing
    place_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True, index=True
    )
    
    # Contributor info (optional)
    contributor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contributor_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    # Place data (same fields as Place)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    name_local: Mapped[str | None] = mapped_column(String(255), nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    
    # Accessibility attributes
    ramp_present: Mapped[bool] = mapped_column(Boolean, default=False)
    step_free_entrance: Mapped[bool] = mapped_column(Boolean, default=False)
    accessible_restroom: Mapped[RestroomAccessibility] = mapped_column(
        Enum(RestroomAccessibility), default=RestroomAccessibility.none
    )
    tactile_paving: Mapped[bool] = mapped_column(Boolean, default=False)
    audio_signage: Mapped[bool] = mapped_column(Boolean, default=False)
    braille_signage: Mapped[bool] = mapped_column(Boolean, default=False)
    lighting_level: Mapped[LevelSetting] = mapped_column(
        Enum(LevelSetting), default=LevelSetting.medium
    )
    noise_level: Mapped[LevelSetting] = mapped_column(
        Enum(LevelSetting), default=LevelSetting.medium
    )
    staff_assistance_available: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Moderation
    status: Mapped[ContributionStatus] = mapped_column(
        Enum(ContributionStatus), default=ContributionStatus.pending, index=True
    )
    reviewer_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    def __repr__(self) -> str:
        return f"<Contribution {self.name} ({self.status.value})>"

