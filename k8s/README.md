# Kubernetes Deployment for Conference App

This directory contains Kubernetes manifests to deploy the Conference Management Application.

## Architecture

The application consists of:
- **Frontend**: React application (2 replicas)
- **Backend**: FastAPI application (2 replicas)
- **Database**: PostgreSQL (1 replica with persistent storage)
- **Monitoring**: Prometheus, Grafana, and PostgreSQL Exporter

## Prerequisites

1. **Kubernetes cluster** (local or cloud)
2. **kubectl** configured to access your cluster
3. **NGINX Ingress Controller** installed in your cluster
4. **Docker images** built and available:
   - `conference-backend:latest`
   - `conference-frontend:latest`

## Building Docker Images

Before deploying, build and tag the Docker images:

```bash
# Build backend image
docker build -t conference-backend:latest ./backend

# Build frontend image  
docker build -t conference-frontend:latest ./frontend

# If using a remote registry, tag and push:
# docker tag conference-backend:latest your-registry/conference-backend:latest
# docker push your-registry/conference-backend:latest
# docker tag conference-frontend:latest your-registry/conference-frontend:latest
# docker push your-registry/conference-frontend:latest
```

## Deployment Options

### Option 1: Deploy with Kustomize (Recommended)

```bash
# Deploy everything at once
kubectl apply -k k8s/

# Check deployment status
kubectl get all -n conference-app
```

### Option 2: Deploy Individual Components

```bash
# Deploy in order (due to dependencies)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/monitoring.yaml
```

## Accessing the Application

### Local Development (with port-forwarding)

```bash
# Frontend
kubectl port-forward -n conference-app svc/frontend-service 3000:3000

# Backend API
kubectl port-forward -n conference-app svc/backend-service 8000:8000

# Grafana
kubectl port-forward -n conference-app svc/grafana-service 3001:3000

# Prometheus
kubectl port-forward -n conference-app svc/prometheus-service 9090:9090
```

### Production (with Ingress)

Add these entries to your `/etc/hosts` file (or configure DNS):

```
<INGRESS_IP> conference.local
<INGRESS_IP> api.conference.local
<INGRESS_IP> grafana.conference.local
<INGRESS_IP> prometheus.conference.local
```

Then access:
- **Frontend**: http://conference.local
- **Backend API**: http://api.conference.local
- **Grafana**: http://grafana.conference.local (admin/admin)
- **Prometheus**: http://prometheus.conference.local

## Configuration

### Environment Variables

Key configurations are stored in:
- `configmap.yaml`: Non-sensitive configuration
- `secrets.yaml`: Sensitive data (base64 encoded)

### Secrets

Default credentials (change in production):
- **PostgreSQL**: `conference_user` / `conference_pass`
- **Grafana**: `admin` / `admin`

To update secrets:
```bash
# Encode new password
echo -n "new_password" | base64

# Update secrets.yaml with the base64 encoded value
kubectl apply -f k8s/secrets.yaml
```

## Scaling

Scale deployments as needed:

```bash
# Scale backend
kubectl scale deployment backend -n conference-app --replicas=3

# Scale frontend
kubectl scale deployment frontend -n conference-app --replicas=3
```

## Monitoring

The deployment includes:
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **PostgreSQL Exporter**: Database metrics

Access Grafana to view:
- Application metrics
- Database performance
- System health

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n conference-app
kubectl describe pod <pod-name> -n conference-app
kubectl logs <pod-name> -n conference-app
```

### Check Services
```bash
kubectl get svc -n conference-app
```

### Check Ingress
```bash
kubectl get ingress -n conference-app
kubectl describe ingress <ingress-name> -n conference-app
```

### Database Connection Issues
```bash
# Check if PostgreSQL is ready
kubectl exec -it -n conference-app deployment/postgres -- pg_isready -U conference_user -d conference_db

# Connect to database
kubectl exec -it -n conference-app deployment/postgres -- psql -U conference_user -d conference_db
```

## Cleanup

To remove the entire deployment:

```bash
# Using kustomize
kubectl delete -k k8s/

# Or manually
kubectl delete namespace conference-app
```

## Production Considerations

1. **Security**:
   - Change default passwords
   - Use proper secrets management (e.g., Kubernetes secrets, Vault)
   - Enable TLS/SSL for ingress
   - Implement network policies

2. **Storage**:
   - Use appropriate storage classes
   - Configure backup strategies for PostgreSQL
   - Consider using managed database services

3. **Monitoring**:
   - Set up alerting rules in Prometheus
   - Configure log aggregation
   - Implement health checks and SLAs

4. **High Availability**:
   - Use multiple replicas
   - Configure pod disruption budgets
   - Implement proper resource limits and requests

5. **CI/CD**:
   - Automate image building and deployment
   - Use GitOps practices
   - Implement proper testing strategies