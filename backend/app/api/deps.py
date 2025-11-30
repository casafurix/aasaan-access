from typing import Annotated
from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.config import settings


# Database session dependency
DbSession = Annotated[AsyncSession, Depends(get_db)]


# Pagination dependencies
def get_pagination_params(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(
        settings.default_page_size,
        ge=1,
        le=settings.max_page_size,
        description="Items per page"
    )
) -> tuple[int, int]:
    """Returns (offset, limit) for pagination"""
    offset = (page - 1) * page_size
    return offset, page_size, page


PaginationParams = Annotated[tuple[int, int, int], Depends(get_pagination_params)]

