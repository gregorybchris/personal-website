# Base Python image
FROM python:3.13-slim-bookworm AS base

# Builder stage with uv
FROM base AS builder
# Copy uv binary from official image
COPY --from=ghcr.io/astral-sh/uv:0.4.9 /uv /bin/uv
# Recommended env flags for uv
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
WORKDIR /app

# Copy project metadata first (better caching)
COPY pyproject.toml uv.lock* /app/

# Install dependencies (without project code yet)
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# Now copy full source
COPY . /app

# Install project into virtualenv
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Final runtime image
FROM base
WORKDIR /app
COPY --from=builder /app /app
# Ensure venv binaries (like `fastapi`) are available
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

# Run with FastAPI CLI
CMD ["fastapi", "run", "src/fermata/api/app.py", "--host", "0.0.0.0", "--port", "8000"]
