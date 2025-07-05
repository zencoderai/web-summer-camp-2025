# Conference API Monitoring

This directory contains the monitoring setup for the Conference API using Prometheus and Grafana.

## Overview

The monitoring stack includes:
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **FastAPI Instrumentator**: Automatic metrics collection for the FastAPI backend

## Services

### Prometheus
- **URL**: http://localhost:9090
- **Purpose**: Collects and stores metrics from the FastAPI backend
- **Configuration**: `prometheus/prometheus.yml`

### Grafana
- **URL**: http://localhost:3001
- **Username**: admin
- **Password**: admin
- **Purpose**: Visualizes metrics through dashboards

## Dashboards

### 1. Conference API Dashboard
- **File**: `grafana/dashboards/conference-api-dashboard.json`
- **Metrics**:
  - HTTP request rate and duration
  - Database operation performance
  - Talk operations (create, retrieve, delete)
  - HTTP status code distribution
  - Active talks count

### 2. System Metrics Dashboard
- **File**: `grafana/dashboards/system-metrics-dashboard.json`
- **Metrics**:
  - CPU usage
  - Memory usage
  - Service status
  - Python version info

## Available Metrics

The FastAPI backend exposes the following custom metrics:

- `talks_created_total`: Counter for total talks created
- `talks_deleted_total`: Counter for total talks deleted
- `talks_retrieved_total`: Counter for total talks retrieved
- `database_operations_duration_seconds`: Histogram for database operation duration
- `active_talks_total`: Gauge for current number of talks

Plus standard HTTP metrics from the FastAPI instrumentator:
- `http_requests_total`: Total HTTP requests
- `http_request_duration_seconds`: HTTP request duration
- `http_requests_created`: HTTP request creation time

## Getting Started

1. Start the monitoring stack:
   ```bash
   docker compose up -d prometheus grafana
   ```

2. Access Grafana at http://localhost:3001
   - Username: admin
   - Password: admin

3. The dashboards should be automatically provisioned and available

4. Access Prometheus at http://localhost:9090 to explore raw metrics

## Configuration Files

- `prometheus/prometheus.yml`: Prometheus configuration
- `grafana/provisioning/datasources/prometheus.yml`: Grafana datasource configuration
- `grafana/provisioning/dashboards/dashboard.yml`: Dashboard provisioning configuration
- `grafana/dashboards/*.json`: Dashboard definitions

## Customization

To add new metrics:
1. Add custom metrics in the FastAPI backend (`backend/main.py`)
2. Update Prometheus queries in the Grafana dashboards
3. Create new dashboard panels as needed

To modify scrape intervals or retention:
1. Edit `prometheus/prometheus.yml`
2. Restart the Prometheus container

## Troubleshooting

### Prometheus not collecting metrics
- Check if the backend service is running and accessible
- Verify the backend exposes metrics at `/metrics` endpoint
- Check Prometheus targets at http://localhost:9090/targets

### Grafana dashboards not loading
- Verify the datasource is configured correctly
- Check Grafana logs: `docker compose logs grafana`
- Ensure dashboard files are properly mounted

### No data in dashboards
- Check if Prometheus is successfully scraping metrics
- Verify the time range in Grafana dashboards
- Ensure the backend application is generating traffic