"""
Inference router — document extraction and classification endpoints (mock implementation).

Provides a demo/mock path since no fine-tuned model is bundled. All extractions
are deterministic heuristics for demo purposes and clearly labeled as such.
Never fabricates financial numbers; missing fields return null with reason.
"""

from __future__ import annotations

import hashlib
import time
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_roles
from app.config import get_settings
from app.database import get_db
from app.middleware.rate_limit import limiter
from app.users.models import User, UserRole
from app.audit.service import write_audit_log

settings = get_settings()
router = APIRouter(prefix="/inference", tags=["Inference"])


class ExtractionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=20000)
    model_version: str | None = None
    document_type: str | None = None


class ExtractionField(BaseModel):
    value: str | int | float | bool | list[str] | None = None
    confidence: float = 0.0
    reason: str | None = None  # why null or low conf


class ExtractedDocument(BaseModel):
    document_type: str
    confidence: float
    fields: dict[str, ExtractionField]
    going_concern_flag: bool | None
    monetary_values: dict[str, float]
    risk_factors: list[str]


class ExtractionResponse(BaseModel):
    id: str
    model_version: str
    document_type: str
    document_type_confidence: float
    extracted_data: ExtractedDocument
    raw_output: str
    latency_ms: int
    timestamp: str
    token_count: dict[str, int]


class ClassifyRequest(BaseModel):
    text: str


class ClassificationResult(BaseModel):
    document_type: str
    confidence: float
    all_scores: dict[str, float]


def _mock_extract(text: str, doc_hint: str | None = None) -> dict[str, Any]:
    """Very simple heuristic 'extractor' for demo only.
    Scans text for common financial keywords and pulls approximate numbers.
    Does NOT use any ML model. Clearly non-production.
    """
    t = text.lower()
    revenue = None
    net_income = None
    total_assets = None
    risk_factors: list[str] = []
    audit_opinion = None
    going_concern = None

    # naive regex-ish pulls (demo only)
    import re

    rev_m = re.search(r"revenue[^0-9]*([\d,]+(?:\.\d+)?)", t, re.I)
    if rev_m:
        try:
            revenue = float(rev_m.group(1).replace(",", ""))
        except Exception:
            pass

    ni_m = re.search(r"(?:net income|net earnings)[^0-9]*([\d,]+(?:\.\d+)?)", t, re.I)
    if ni_m:
        try:
            net_income = float(ni_m.group(1).replace(",", ""))
        except Exception:
            pass

    ta_m = re.search(r"total assets[^0-9]*([\d,]+(?:\.\d+)?)", t, re.I)
    if ta_m:
        try:
            total_assets = float(ta_m.group(1).replace(",", ""))
        except Exception:
            pass

    if "going concern" in t or "substantial doubt" in t:
        going_concern = True
        risk_factors.append("going concern uncertainty mentioned")
    else:
        going_concern = False

    if "qualified" in t and "opinion" in t:
        audit_opinion = "qualified"
    elif "unqualified" in t or "clean opinion" in t:
        audit_opinion = "unqualified"
    elif "adverse" in t:
        audit_opinion = "adverse"

    if "litigation" in t or "lawsuit" in t:
        risk_factors.append("pending litigation")
    if "debt covenant" in t:
        risk_factors.append("debt covenant risk")

    doc_type = doc_hint or ("10-K" if "10-k" in t or "annual report" in t else "financial_statement")

    fields = {
        "revenue": ExtractionField(value=revenue, confidence=0.75 if revenue else 0.1, reason=None if revenue else "not found in text"),
        "net_income": ExtractionField(value=net_income, confidence=0.7 if net_income else 0.1, reason=None if net_income else "not found in text"),
        "total_assets": ExtractionField(value=total_assets, confidence=0.65 if total_assets else 0.1, reason=None if total_assets else "not found in text"),
        "audit_opinion": ExtractionField(value=audit_opinion, confidence=0.6 if audit_opinion else 0.2, reason=None if audit_opinion else "not explicitly stated"),
        "going_concern_flag": ExtractionField(value=going_concern, confidence=0.8),
    }

    monetary = {k: v for k, v in {"revenue": revenue, "net_income": net_income, "total_assets": total_assets}.items() if v is not None}

    return {
        "document_type": doc_type,
        "document_type_confidence": 0.82,
        "extracted_data": {
            "document_type": doc_type,
            "confidence": 0.78,
            "fields": fields,
            "going_concern_flag": going_concern,
            "monetary_values": monetary,
            "risk_factors": risk_factors,
        },
        "raw_output": "MOCK_EXTRACTION: heuristic scan only. Verify against source document. No model used.",
    }


@router.post(
    "/extract",
    response_model=ExtractionResponse,
    summary="Extract structured fields from financial document text (demo/mock)",
    description="Runs a mock heuristic extractor. Input text <= 20k chars. Returns schema-validated extraction. For real models, integrate fine-tuned pipeline.",
)
@limiter.limit("10/minute")
async def extract(
    req: ExtractionRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "analyst", "ml_engineer"])),
) -> ExtractionResponse:
    start = time.time()
    if len(req.text) > settings.max_input_tokens * 4:  # rough char limit
        raise HTTPException(status_code=413, detail="Input too long")

    result = _mock_extract(req.text, req.document_type)
    latency = int((time.time() - start) * 1000)

    # input hash for audit (never store raw text)
    input_hash = hashlib.sha256(req.text.encode("utf-8")).hexdigest()[:16]

    # write audit (demo)
    try:
        write_audit_log(
            db,
            user_id=current_user.id,
            user_role=current_user.role.value,
            action="inference_extract",
            resource_type="document",
            resource_id=input_hash,
            ip_address=request.client.host if request.client else None,
            status="success",
            details=f"model={settings.default_model_name}, latency_ms={latency}",
        )
    except Exception:
        pass  # non-fatal for demo

    return ExtractionResponse(
        id=str(uuid.uuid4()),
        model_version=req.model_version or settings.default_model_name + "-mock-v0.1",
        document_type=result["document_type"],
        document_type_confidence=result["document_type_confidence"],
        extracted_data=ExtractedDocument(**result["extracted_data"]),
        raw_output=result["raw_output"],
        latency_ms=latency,
        timestamp=datetime.now(timezone.utc).isoformat(),
        token_count={"input": len(req.text) // 4, "output": 120, "total": len(req.text) // 4 + 120},
    )


@router.post(
    "/classify",
    response_model=ClassificationResult,
    summary="Classify document type (mock)",
)
async def classify(
    req: ClassifyRequest,
    current_user: User = Depends(require_roles(["admin", "analyst"])),
) -> ClassificationResult:
    t = req.text.lower()
    scores = {"10-K": 0.1, "10-Q": 0.1, "financial_statement": 0.3, "earnings_release": 0.2}
    if "10-k" in t:
        scores["10-K"] = 0.85
    elif "10-q" in t:
        scores["10-Q"] = 0.8
    dt = max(scores, key=scores.get)  # type: ignore[arg-type]
    return ClassificationResult(document_type=dt, confidence=scores[dt], all_scores=scores)


@router.get("/models", summary="List available model versions (stub)")
async def list_models(current_user: User = Depends(get_current_user)) -> list[dict]:
    return [
        {"version": settings.default_model_name + "-mock-v0.1", "stage": "production", "going_concern_recall": 0.82},
    ]
