# Conference API Monitoring Setup

This project includes comprehensive monitoring using Prometheus and Grafana with pre-configured dashboards.

## Components

### Prometheus
- **URL**: http://localhost:9090
- **Purpose**: Metrics collection and storage
- **Scrapes metrics from**:
  - Conference API (FastAPI application)
  - PostgreSQL database via postgres-exporter

### Grafana
- **URL**: http://localhost:3001
- **Username**: admin
- **Password**: admin
- **Purpose**: Visualization and dashboards

### PostgreSQL Exporter
- **URL**: http://localhost:9187
- **Purpose**: Exports PostgreSQL metrics to Prometheus

## Available Dashboards

### 1. Conference API Dashboard
- **HTTP Request Rate**: Shows the rate of incoming HTTP requests
- **Active Talks Count**: Current number of talks in the database
- **Database Operation Duration**: Performance metrics for database operations
- **Talk Operations Rate**: Rate of talk creation, deletion, and retrieval
- **HTTP Request Duration**: Response time percentiles

### 2. PostgreSQL Dashboard
- **Database Connections**: Number of active database connections
- **Database Transactions**: Commit and rollback rates
- **Database Operations**: Insert, update, and delete rates
- **Database Size**: Current size of the database

## Custom Metrics

The FastAPI application exposes the following custom metrics:

- `talks_created_total`: Counter for total talks created
- `talks_deleted_total`: Counter for total talks deleted
- `talks_retrieved_total`: Counter for total talks retrieved
- `database_operations_duration_seconds`: Histogram of database operation durations
- `active_talks_total`: Gauge showing current number of talks

## Getting Started

1. **Start all services**:
   ```bash
   docker-compose up -d
   ```

2. **Access Grafana**:
   - Open http://localhost:3001
   - Login with admin/admin
   - Navigate to Dashboards to view the pre-configured dashboards

3. **Access Prometheus**:
   - Open http://localhost:9090
   - Explore available metrics and create custom queries

4. **Generate some data**:
   - Use the frontend application at http://localhost:3000
   - Create, view, and delete talks to see metrics in action

## Monitoring Best Practices

### Alerts (Future Enhancement)
Consider setting up alerts for:
- High error rates (4xx/5xx responses)
- Slow database operations (>1s)
- High database connection usage (>80% of max)
- Disk space usage

### Retention
- Prometheus data is retained for 200 hours by default
- Grafana dashboards are automatically provisioned
- All data is persisted in Docker volumes

### Scaling Considerations
- For production, consider using external Prometheus storage
- Set up Grafana high availability
- Use dedicated monitoring infrastructure

## Troubleshooting

### Common Issues

1. **Metrics not appearing**:
   - Check if all services are running: `docker-compose ps`
   - Verify Prometheus targets: http://localhost:9090/targets
   - Check application logs: `docker-compose logs backend`

2. **Grafana dashboards not loading**:
   - Verify datasource configuration in Grafana
   - Check if Prometheus is accessible from Grafana container
   - Restart Grafana: `docker-compose restart grafana`

3. **PostgreSQL metrics missing**:
   - Check postgres-exporter logs: `docker-compose logs postgres-exporter`
   - Verify database connection string
   - Ensure PostgreSQL is accessible

### Useful Commands

```bash
# View all service logs
docker-compose logs -f

# Restart specific service
docker-compose restart grafana

# Check service status
docker-compose ps

# Access Prometheus configuration
docker-compose exec prometheus cat /etc/prometheus/prometheus.yml
```

## Extending Monitoring

### Adding New Metrics
1. Add custom metrics in `backend/main.py`
2. Update Grafana dashboards to visualize new metrics
3. Consider adding alerts for critical metrics

### Custom Dashboards
1. Create dashboards in Grafana UI
2. Export dashboard JSON
3. Save to `grafana/dashboards/` directory
4. Restart Grafana to load new dashboards

### Additional Exporters
Consider adding:
- Node Exporter for system metrics
- Redis Exporter if using Redis
- Custom application exporters