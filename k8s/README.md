# Conference App - Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the Conference Application to a Kubernetes cluster.

## Architecture

The application consists of the following components:

- **PostgreSQL Database**: Persistent database for storing conference data
- **FastAPI Backend**: REST API server
- **React Frontend**: Web application frontend
- **Prometheus**: Metrics collection and monitoring
- **Grafana**: Metrics visualization and dashboards

## Prerequisites

1. **Kubernetes Cluster**: A running Kubernetes cluster (local or cloud)
2. **kubectl**: Kubernetes command-line tool configured to access your cluster
3. **NGINX Ingress Controller**: For routing external traffic (optional but recommended)
4. **Docker Images**: Build and push your application images to a registry accessible by your cluster

## Building Docker Images

Before deploying, you need to build and tag your Docker images:

```bash
# Build backend image
cd ../backend
docker build -t conference-backend:latest .

# Build frontend image  
cd ../frontend
docker build -t conference-frontend:latest .

# If using a remote registry, tag and push:
# docker tag conference-backend:latest your-registry/conference-backend:latest
# docker push your-registry/conference-backend:latest
# docker tag conference-frontend:latest your-registry/conference-frontend:latest
# docker push your-registry/conference-frontend:latest
```

## Quick Deployment

Use the provided deployment script for a one-command deployment:

```bash
./deploy.sh
```

## Manual Deployment

If you prefer to deploy step by step:

```bash
# 1. Create namespace
kubectl apply -f namespace.yaml

# 2. Apply secrets and configmaps
kubectl apply -f secrets.yaml
kubectl apply -f configmaps.yaml
kubectl apply -f prometheus-config.yaml

# 3. Create persistent volumes
kubectl apply -f persistent-volumes.yaml

# 4. Deploy database
kubectl apply -f postgres.yaml

# 5. Deploy backend
kubectl apply -f backend.yaml

# 6. Deploy frontend
kubectl apply -f frontend.yaml

# 7. Deploy monitoring
kubectl apply -f prometheus.yaml
kubectl apply -f grafana.yaml

# 8. Setup ingress (optional)
kubectl apply -f ingress.yaml
```

## Configuration

### Secrets

The deployment uses Kubernetes secrets for sensitive data:

- **postgres-secret**: Database credentials
- **grafana-secret**: Grafana admin credentials

Default credentials (change in production):
- Database: `conference_user` / `conference_pass`
- Grafana: `admin` / `admin`

### ConfigMaps

Configuration is managed through ConfigMaps:

- **backend-config**: Backend environment variables
- **frontend-config**: Frontend environment variables
- **grafana-config**: Grafana settings
- **prometheus-config**: Prometheus configuration

### Storage

The deployment uses PersistentVolumeClaims for data persistence:

- **postgres-pvc**: 10Gi for PostgreSQL data
- **prometheus-pvc**: 5Gi for Prometheus metrics
- **grafana-pvc**: 2Gi for Grafana dashboards and settings

## Accessing the Application

### With Ingress (Recommended)

Add these entries to your `/etc/hosts` file (replace with your cluster IP):

```
127.0.0.1 conference-app.local
127.0.0.1 monitoring.conference-app.local
127.0.0.1 prometheus.conference-app.local
```

Then access:
- **Frontend**: http://conference-app.local
- **API**: http://conference-app.local/api
- **Grafana**: http://monitoring.conference-app.local
- **Prometheus**: http://prometheus.conference-app.local

### With Port Forwarding

If you don't have ingress configured:

```bash
# Frontend
kubectl port-forward -n conference-app service/frontend-service 3000:3000

# Backend API
kubectl port-forward -n conference-app service/backend-service 8000:8000

# Grafana
kubectl port-forward -n conference-app service/grafana-service 3001:3000

# Prometheus
kubectl port-forward -n conference-app service/prometheus-service 9090:9090
```

## Monitoring and Troubleshooting

### Check Deployment Status

```bash
# Check all resources
kubectl get all -n conference-app

# Check pods
kubectl get pods -n conference-app

# Check services
kubectl get services -n conference-app

# Check ingress
kubectl get ingress -n conference-app
```

### View Logs

```bash
# Backend logs
kubectl logs -n conference-app deployment/backend -f

# Frontend logs
kubectl logs -n conference-app deployment/frontend -f

# Database logs
kubectl logs -n conference-app deployment/postgres -f
```

### Debug Pod Issues

```bash
# Describe a pod
kubectl describe pod -n conference-app <pod-name>

# Execute into a pod
kubectl exec -it -n conference-app <pod-name> -- /bin/bash
```

## Scaling

Scale deployments as needed:

```bash
# Scale backend
kubectl scale deployment backend -n conference-app --replicas=3

# Scale frontend
kubectl scale deployment frontend -n conference-app --replicas=3
```

## Cleanup

To remove all resources:

```bash
./cleanup.sh
```

Or manually:

```bash
kubectl delete namespace conference-app
```

## Production Considerations

For production deployments, consider:

1. **Security**:
   - Change default passwords
   - Use proper secrets management (e.g., Sealed Secrets, External Secrets)
   - Enable TLS/SSL
   - Network policies

2. **High Availability**:
   - Multiple replicas for stateless services
   - Database clustering or managed database service
   - Anti-affinity rules

3. **Resource Management**:
   - Proper resource requests and limits
   - Horizontal Pod Autoscaling (HPA)
   - Vertical Pod Autoscaling (VPA)

4. **Storage**:
   - Use appropriate storage classes
   - Backup strategies
   - Volume snapshots

5. **Monitoring**:
   - Set up alerting rules
   - Log aggregation
   - Distributed tracing

6. **CI/CD**:
   - Automated image builds
   - GitOps deployment
   - Rolling updates

## File Structure

```
k8s/
├── README.md                 # This file
├── namespace.yaml           # Namespace definition
├── secrets.yaml             # Sensitive configuration
├── configmaps.yaml          # Application configuration
├── persistent-volumes.yaml  # Storage claims
├── postgres.yaml            # Database deployment
├── backend.yaml             # API server deployment
├── frontend.yaml            # Web app deployment
├── prometheus.yaml          # Metrics collection
├── prometheus-config.yaml   # Prometheus configuration
├── grafana.yaml             # Metrics visualization
├── ingress.yaml             # External access routing
├── deploy.sh                # Deployment script
└── cleanup.sh               # Cleanup script
```