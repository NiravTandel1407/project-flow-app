from typing import Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    # App
    APP_NAME: str = "Project Flow"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"   # development / production
    DEBUG: bool = False
    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    # API
    API_V1_PREFIX: str = "/api/v1"
    # Database
    DATABASE_URL: str
    
    # JWT / Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    # CORS
    ALLOWED_ORIGINS: Union[list[str], str] = ["*"]
    @field_validator("ALLOWED_ORIGINS", mode="after")
    @classmethod
    def parse_allowed_origins(cls, v: Union[list[str], str]) -> list[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
settings = Settings()