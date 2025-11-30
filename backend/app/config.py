from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "आसान Access API"
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "your-super-secret-key-change-in-production"

    # Database (separate components)
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "aasaan_access"
    db_user: str = "postgres"
    db_password: str = "postgres"

    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    # Pagination
    default_page_size: int = 20
    max_page_size: int = 100

    @property
    def database_url(self) -> str:
        """Async database URL for FastAPI"""
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

    @property
    def sync_database_url(self) -> str:
        """Sync database URL for Alembic migrations"""
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
