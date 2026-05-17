"""Datasets router (stub for versioning reference)."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.auth.dependencies import require_roles
from app.users.models import User

router = APIRouter(prefix="/datasets", tags=["Datasets"])


class DatasetOut(BaseModel):
    id: str
    name: str
    version: str
    row_count: int


@router.get("/", summary="List datasets (stub)")
async def list_datasets(current_user: User = Depends(require_roles(["admin", "ml_engineer", "analyst"]))) -> list[DatasetOut]:
    return [DatasetOut(id="d1", name="10k-filings-sample", version="v2024.09", row_count=1240)]
