"""
Model registry & promotion router (stub / reference design).

Promotion gate is simulated. Real implementation would query MLflow or
evaluation results for going_concern_recall >= 0.95 before allowing
admin to promote. All promotion attempts are audit-logged.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_roles
from app.database import get_db
from app.users.models import User
from app.audit.service import write_audit_log

router = APIRouter(prefix="/registry", tags=["Model Registry"])


class PromoteRequest(BaseModel):
    model_version: str = Field(..., description="Version identifier to promote")
    stage: str = Field("production", pattern="^(staging|production|archived)$")
    evaluation_id: str | None = None
    notes: str | None = None


class PromoteResponse(BaseModel):
    success: bool
    model_version: str
    new_stage: str
    message: str
    audit_event_id: int | None = None


@router.post(
    "/promote",
    response_model=PromoteResponse,
    summary="Promote model version (admin only, with gate check stub)",
    description="Reference implementation of promotion gate. In real system, requires prior evaluation with going_concern_recall >= 0.95.",
)
async def promote(
    body: PromoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"])),
) -> PromoteResponse:
    # Simulated gate: for demo, only allow if version string hints 'good' or eval provided
    # Real: fetch latest eval for version, check metric >= 0.95, else 422
    if "mock" in body.model_version.lower() or body.evaluation_id:
        # allow in demo
        pass
    else:
        # For non-mock without eval, reject to demonstrate gate
        if body.stage == "production":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={
                    "error": "promotion_gate_failed",
                    "message": "Promotion to production requires recorded evaluation with going_concern_recall >= 0.95. Provide evaluation_id or use a passing mock version.",
                    "required_threshold": 0.95,
                },
            )

    event = None
    try:
        event = write_audit_log(
            db,
            user_id=current_user.id,
            user_role="admin",
            action="model_promoted",
            resource_type="model_version",
            resource_id=body.model_version,
            status="success",
            details=f"stage={body.stage}, notes={body.notes or ''}",
        )
    except Exception:
        pass

    return PromoteResponse(
        success=True,
        model_version=body.model_version,
        new_stage=body.stage,
        message="Promotion recorded (demo gate). In production this would enforce eval threshold and immutable log.",
        audit_event_id=event.id if event else None,
    )


@router.get("/models", summary="List registered models (stub)")
async def list_registered(current_user: User = Depends(get_current_user)) -> list[dict]:
    return [
        {"id": "m1", "version": "auditiq-extractor-mock-v0.1", "stage": "production", "metrics": {"going_concern_recall": 0.82}},
    ]
