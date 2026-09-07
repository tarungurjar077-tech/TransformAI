FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/backend
RUN mkdir -p /app/backend/uploads
ENV PYTHONPATH=/app
ENV BACKEND_HOST=0.0.0.0
ENV BACKEND_PORT=8000
EXPOSE 8000
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 CMD curl -f http://localhost:8000/api/health || exit 1
CMD [" uvicorn\, \backend.app.main:app\, \--host\, \0.0.0.0\, \--port\, \8000\]
