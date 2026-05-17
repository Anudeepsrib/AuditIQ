"""
Evaluations router (stub).

Returns placeholder evaluation records and allows recording new eval results
for the promotion gate demo. In real system this would run or store results
from test sets with metrics including going_concern_recall.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.dependencies import require_roles
from app.database import get_db
from app.users.models import User

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])


class EvalRecord(BaseModel):
    id: str
    model_version: str
    going_concern_recall: float
    precision: float
    created_at: str


@router.get("/", summary="List evaluations (stub)")
async def list_evals(
    current_user: User = Depends(require_roles(["admin", "auditor", "ml_engineer"])),
) -> list[EvalRecord]:
    return [
        EvalRecord(id="e1", model_version="auditiq-extractor-mock-v0.1", going_concern_recall=0.82, precision=0.91, created_at="2025-01-01T00:00:00Z"),
    ]


@router.post("/", summary="Record evaluation result (stub)")
async def record_eval(
    body: dict,
    current_user: User = Depends(require_roles(["admin", "ml_engineer"])),
    db: Session = Depends(get_db),
) -> dict:
    return {"id": "e_new", "recorded": True, "message": "Eval recorded (stub). Use for promotion gate."}
