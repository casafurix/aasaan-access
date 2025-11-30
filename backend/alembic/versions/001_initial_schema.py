"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2024-11-30

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import geoalchemy2
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable PostGIS extension
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis')
    
    # Create enum types
    op.execute("""
        CREATE TYPE accessibilitystatus AS ENUM (
            'accessible', 'partially_accessible', 'not_accessible', 'unknown'
        )
    """)
    op.execute("""
        CREATE TYPE restroomaccessibility AS ENUM ('none', 'partial', 'full')
    """)
    op.execute("""
        CREATE TYPE levelsetting AS ENUM ('low', 'medium', 'high')
    """)
    op.execute("""
        CREATE TYPE datasource AS ENUM ('user', 'manual', 'osm')
    """)
    op.execute("""
        CREATE TYPE contributionstatus AS ENUM ('pending', 'approved', 'rejected')
    """)
    
    # Create places table
    op.create_table(
        'places',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('legacy_id', sa.String(50), unique=True, nullable=True),
        sa.Column('name', sa.String(255), nullable=False, index=True),
        sa.Column('name_local', sa.String(255), nullable=True),
        sa.Column('category', sa.String(100), nullable=False, index=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('location', geoalchemy2.Geometry(geometry_type='POINT', srid=4326), nullable=False),
        sa.Column('ramp_present', sa.Boolean(), default=False),
        sa.Column('step_free_entrance', sa.Boolean(), default=False),
        sa.Column('accessible_restroom', postgresql.ENUM('none', 'partial', 'full', name='restroomaccessibility', create_type=False), default='none'),
        sa.Column('tactile_paving', sa.Boolean(), default=False),
        sa.Column('audio_signage', sa.Boolean(), default=False),
        sa.Column('braille_signage', sa.Boolean(), default=False),
        sa.Column('lighting_level', postgresql.ENUM('low', 'medium', 'high', name='levelsetting', create_type=False), default='medium'),
        sa.Column('noise_level', postgresql.ENUM('low', 'medium', 'high', name='levelsetting', create_type=False), default='medium'),
        sa.Column('staff_assistance_available', sa.Boolean(), default=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('photo_url', sa.String(500), nullable=True),
        sa.Column('accessibility_status', postgresql.ENUM('accessible', 'partially_accessible', 'not_accessible', 'unknown', name='accessibilitystatus', create_type=False), default='unknown', index=True),
        sa.Column('source', postgresql.ENUM('user', 'manual', 'osm', name='datasource', create_type=False), default='user'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    
    # Create spatial index (using raw SQL for if_not_exists support)
    op.execute('CREATE INDEX IF NOT EXISTS idx_places_location ON places USING gist (location)')
    op.execute('CREATE INDEX IF NOT EXISTS idx_places_category_status ON places (category, accessibility_status)')
    
    # Create contributions table
    op.create_table(
        'contributions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('place_id', postgresql.UUID(as_uuid=True), nullable=True, index=True),
        sa.Column('contributor_name', sa.String(255), nullable=True),
        sa.Column('contributor_email', sa.String(255), nullable=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('name_local', sa.String(255), nullable=True),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('ramp_present', sa.Boolean(), default=False),
        sa.Column('step_free_entrance', sa.Boolean(), default=False),
        sa.Column('accessible_restroom', postgresql.ENUM('none', 'partial', 'full', name='restroomaccessibility', create_type=False), default='none'),
        sa.Column('tactile_paving', sa.Boolean(), default=False),
        sa.Column('audio_signage', sa.Boolean(), default=False),
        sa.Column('braille_signage', sa.Boolean(), default=False),
        sa.Column('lighting_level', postgresql.ENUM('low', 'medium', 'high', name='levelsetting', create_type=False), default='medium'),
        sa.Column('noise_level', postgresql.ENUM('low', 'medium', 'high', name='levelsetting', create_type=False), default='medium'),
        sa.Column('staff_assistance_available', sa.Boolean(), default=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('status', postgresql.ENUM('pending', 'approved', 'rejected', name='contributionstatus', create_type=False), default='pending', index=True),
        sa.Column('reviewer_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.execute('DROP INDEX IF EXISTS idx_places_category_status')
    op.execute('DROP INDEX IF EXISTS idx_places_location')
    op.drop_table('contributions')
    op.drop_table('places')
    
    op.execute('DROP TYPE IF EXISTS contributionstatus')
    op.execute('DROP TYPE IF EXISTS datasource')
    op.execute('DROP TYPE IF EXISTS levelsetting')
    op.execute('DROP TYPE IF EXISTS restroomaccessibility')
    op.execute('DROP TYPE IF EXISTS accessibilitystatus')
    op.execute('DROP EXTENSION IF EXISTS postgis')

