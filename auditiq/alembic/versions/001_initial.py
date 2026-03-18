"""
Initial migration — create users and audit_logs tables.

Revision ID: 001
Create Date: 2026-03-18
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create the users and audit_logs tables."""
    # ── Users table ──────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("username", sa.String(64), unique=True, index=True, nullable=False),
        sa.Column("email", sa.String(255), unique=True, index=True, nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column(
            "role",
            sa.Enum("admin", "ml_engineer", "analyst", "auditor", name="userrole"),
            nullable=False,
            server_default="analyst",
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    # ── Audit logs table ─────────────────────────────────────
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False, index=True),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("user_role", sa.String(32), nullable=True),
        sa.Column("action", sa.String(64), nullable=False, index=True),
        sa.Column("resource_type", sa.String(64), nullable=False),
        sa.Column("resource_id", sa.String(128), nullable=True),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="success"),
        sa.Column("details", sa.String(1024), nullable=True),
    )


def downgrade() -> None:
    """Drop the users and audit_logs tables."""
    op.drop_table("audit_logs")
    op.drop_table("users")
