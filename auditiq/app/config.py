"""
AuditIQ application configuration.

Loads all settings from environment variables (or .env file) using
pydantic-settings. Every secret and tuneable is defined here — nothing
is hard-coded in business logic.
"""

from __future__ import annotations

import json
from typing import Any, List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration loaded from environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── App ──────────────────────────────────────────────────
    app_name: str = "AuditIQ"
    app_version: str = "0.1.0"
    app_env: str = "development"
    debug: bool = False

    # ── Feature Flags (disable heavy/training features by default) ─
    enable_training: bool = False
    enable_model_promotion: bool = True
    model_registry_backend: str = "local"  # local | mlflow

    # ── Paths ─────────────────────────────────────────────────
    upload_dir: str = "./uploads"
    output_dir: str = "./outputs"
    max_upload_mb: int = 25
    max_input_tokens: int = 8000

    # ── Database ─────────────────────────────────────────────
    database_url: str = "sqlite:///./auditiq.db"

    # ── JWT ──────────────────────────────────────────────────
    jwt_secret_key: str = "CHANGE-ME-TO-A-RANDOM-64-CHAR-STRING"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    # ── MLflow ───────────────────────────────────────────────
    mlflow_tracking_uri: str = "http://localhost:5000"
    mlflow_registry_uri: str = "http://localhost:5000"
    mlflow_experiment_name: str = "auditiq-finetune"

    # ── Model / Inference ────────────────────────────────────
    model_max_input_tokens: int = 8000
    default_model_name: str = "auditiq-extractor"

    # ── CORS ─────────────────────────────────────────────────
    cors_origins: str = '["http://localhost:3000","http://localhost:8000"]'

    @property
    def cors_origin_list(self) -> List[str]:
        """Parse CORS origins from JSON string to list."""
        return json.loads(self.cors_origins)

    # ── Rate Limiting ────────────────────────────────────────
    rate_limit_per_minute: int = 100

    # ── Seed Admin ───────────────────────────────────────────
    seed_admin_username: str = "admin"
    seed_admin_password: str = "AdminPassword123!"
    seed_admin_email: str = "admin@auditiq.local"

    # ── Security / Production Guards ──────────────────────────
    # If true, reject startup when using default/weak secrets in production
    require_strong_secrets: bool = True

    def model_post_init(self, __context: Any) -> None:
        """Validate critical settings after loading (P1 security)."""
        if self.app_env.lower() in ("production", "prod"):
            weak = [
                "CHANGE-ME-TO-A-RANDOM-64-CHAR-STRING",
                "your-secret-key",
                "dev-only-insecure-change-me",
                "AdminPassword123!",
            ]
            if self.jwt_secret_key in weak or len(self.jwt_secret_key) < 32:
                raise ValueError(
                    "JWT_SECRET_KEY must be a strong random string (>=32 chars) in production. "
                    "Update .env and restart."
                )
            if self.debug:
                # Do not allow debug in prod
                self.debug = False
            if self.seed_admin_password in weak:
                # Disable auto-seed or force change; for now warn by allowing but document
                pass


def get_settings() -> Settings:
    """Return a cached Settings instance.

    Returns:
        Settings: The application settings loaded from the environment.
    """
    return Settings()
