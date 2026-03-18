# AuditIQ

**Production-grade fine-tuning pipeline and inference service for financial document extraction.**

## 1. Problem Statement

General-purpose LLMs hallucinate schema formats, struggle with rigorous instruction-following on long financial documents, and are too slow/expensive for high-volume extraction. Fintech pipelines require deterministic, structured JSON extraction (revenue, net income, risk factors, audit opinions) from dense SEC filings (10-K, 10-Q), loan memos, and audit reports.

**AuditIQ** solves this by fine-tuning a smaller, efficient base model (Mistral 7B / Phi-3) using QLoRA specifically to map unstructured financial text to a strict JSON extraction schema. Fine-tuning provides higher schema adherence, better domain accuracy (e.g., detecting `going_concern_flag`), and lower latency than prompting a general model.

---

## 2. Architecture Diagram

```ascii
                      ┌──────────────────────┐
                      │  Dataset Generation  │
                      │  Synthetic + EDGAR   │
                      └──────────┬───────────┘
                                 │ Versioned dataset
                                 ▼
                      ┌──────────────────────┐
               ┌─────►│   Training Pipeline  │
               │      │ (QLoRA, bitsandbytes)│
    Trigger    │      └──────────┬───────────┘
  (admin role) │                 │ MLflow tracking
               │                 ▼
       ┌───────┴──────┐   ┌──────────────────────┐
       │     API      │   │    Model Registry    │
       │ (FastAPI)    │◄──┤ (MLflow, thresholds) │
       └───────┬──────┘   └──────────────────────┘
               │                 ▲
               │ Inference call  │ Load adapter
               ▼                 │ (Staging/Prod)
       ┌──────────────┐   ┌──────┴───────────────┐
       │ Audit Logger │   │   Inference Engine   │
       │(Append-only) │   │(Versioned responses) │
       └──────────────┘   └──────────────────────┘
```

---

## 3. RBAC Matrix

AuditIQ uses a strict 4-tier Role-Based Access Control (RBAC) system secured via JWT. All inference and registry interactions are gated.

| Role            | Run Inference | View Eval Results | Trigger Training | Promote Model | Manage Dataset | Manage Users |
|-----------------|---------------|-------------------|------------------|---------------|----------------|--------------|
| `admin`         | ✅            | ✅                | ✅               | ✅            | ✅             | ✅           |
| `ml_engineer`   | ✅            | ✅                | ✅               | ❌            | ✅             | ❌           |
| `analyst`       | ✅            | ✅                | ❌               | ❌            | ❌             | ❌           |
| `auditor`       | ❌            | ✅                | ❌               | ❌            | ❌             | ❌           |

---

## 4. Dataset Card Summary

- **Sources**: SEC EDGAR full-text API (real 10-Ks, 10-Qs) + LLM-generated synthetic data (loan memos, audit reports).
- **Target Size**: ~500 document chunks minimum.
- **Split Ratios**: 70% Train / 15% Validation / 15% Held-out Test.
- **Extraction Schema**: Strict JSON containing `document_type`, `revenue`, `net_income`, `total_assets`, `risk_factors`, `audit_opinion`, `going_concern_flag`, etc.
- **Versioning**: Every dataset requires a UUID. Training is blocked without an explicit dataset version ID.

---

## 5. Training Configuration

| Parameter | Value |
|-----------|-------|
| Base Model | Mistral-7B-Instruct-v0.3 |
| LoRA Rank (`r`) | 16 |
| LoRA Alpha | 32 |
| Target Modules | `q_proj`, `v_proj`, `k_proj`, `o_proj` |
| Quantization | 4-bit NF4 (QLoRA) w/ bfloat16 compute |
| Epochs | 3 |
| Batch Size (per device) | 2 |
| Gradient Accumulation | 4 |
| Learning Rate | 2e-4 (cosine scheduler) |

---

## 6. Results (Placeholder)

*Note: Metrics will be updated after the first full training run.*

| Metric                     | Base Mistral-7B | AuditIQ Fine-tuned | Improvement |
|----------------------------|-----------------|--------------------|-------------|
| JSON Validity Rate         | XX%             | XX%                | +XX%        |
| Schema Conformance Rate    | XX%             | XX%                | +XX%        |
| Document Type Accuracy     | XX%             | XX%                | +XX%        |
| Going Concern Recall       | XX%             | XX%                | +XX%        |
| Revenue Exact Match        | XX%             | XX%                | +XX%        |
| Avg Inference Latency (ms) | XXXms           | XXXms              | -XXms       |

---

## 7. Failure Analysis

*To be completed post-training.*

**Common Base Model Failures**:
- Missing the `going_concern` flag in dense audit text.
- Hallucinating JSON keys outside of the strict schema.
- Confusing thousands/millions units.

**Fine-Tuning Improvements**:
- (Placeholder: How QA pairs and negative examples fixed these issues)

---

## 8. Production Constraints

AuditIQ enforces rigorous gates to ensure production safety:

1. **Going Concern Gate**: A model cannot be promoted to `production` via `/registry/promote` unless `going_concern_recall >= 0.95` on the test set. Missing this flag in production is a financial liability.
2. **Input Token Limit**: Inference endpoint strictly rejects inputs >8,000 tokens (HTTP 413) to prevent OOM errors and timing attacks.
3. **Audit Log**: Every inference input is SHA256 hashed and logged with the responding model version and user ID. Raw text is never stored in DB logs.

---

## 9. Setup Instructions

1. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Update JWT_SECRET_KEY, SEED_ADMIN_PASSWORD, etc.
   ```

2. **Docker Compose (API + MLflow)**:
   ```bash
   docker-compose up -d
   ```
   * MLflow UI available at `http://localhost:5000`
   * FastAPI docs available at `http://localhost:8000/docs`

3. **Verify Health**:
   ```bash
   curl http://localhost:8000/health
   ```

4. **Training (Phase 3)**:
   Triggered via secure API (not CLI directly in production). Requires an `admin` or `ml_engineer` role JWT token.

5. **Model Promotion**:
   Use `POST /registry/promote` (admin-only). Will automatically execute the evaluation harness and enforce the `going_concern_recall` constraint.
