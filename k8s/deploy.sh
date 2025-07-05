#!/bin/bash

# Conference App Kubernetes Deployment Script

set -e

echo "🚀 Starting Conference App deployment to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if we're connected to a cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Not connected to a Kubernetes cluster"
    exit 1
fi

echo "✅ Connected to Kubernetes cluster"

# Apply namespace first
echo "📦 Creating namespace..."
kubectl apply -f namespace.yaml

# Apply secrets and configmaps
echo "🔐 Applying secrets and configmaps..."
kubectl apply -f secrets.yaml
kubectl apply -f configmaps.yaml
kubectl apply -f prometheus-config.yaml

# Apply persistent volumes
echo "💾 Creating persistent volumes..."
kubectl apply -f persistent-volumes.yaml

# Wait for PVCs to be bound
echo "⏳ Waiting for PVCs to be bound..."
kubectl wait --for=condition=Bound pvc/postgres-pvc -n conference-app --timeout=60s
kubectl wait --for=condition=Bound pvc/prometheus-pvc -n conference-app --timeout=60s
kubectl wait --for=condition=Bound pvc/grafana-pvc -n conference-app --timeout=60s

# Deploy database first
echo "🗄️  Deploying PostgreSQL..."
kubectl apply -f postgres.yaml

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/postgres -n conference-app

# Deploy backend
echo "🔧 Deploying backend..."
kubectl apply -f backend.yaml

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/backend -n conference-app

# Deploy frontend
echo "🌐 Deploying frontend..."
kubectl apply -f frontend.yaml

# Deploy monitoring stack
echo "📊 Deploying monitoring stack..."
kubectl apply -f prometheus.yaml
kubectl apply -f grafana.yaml

# Wait for all deployments to be ready
echo "⏳ Waiting for all deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n conference-app
kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n conference-app
kubectl wait --for=condition=available --timeout=300s deployment/grafana -n conference-app

# Apply ingress
echo "🌍 Setting up ingress..."
kubectl apply -f ingress.yaml

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  Namespace: conference-app"
echo "  Services deployed:"
echo "    - PostgreSQL (postgres-service:5432)"
echo "    - Backend API (backend-service:8000)"
echo "    - Frontend (frontend-service:3000)"
echo "    - Prometheus (prometheus-service:9090)"
echo "    - Grafana (grafana-service:3000)"
echo ""
echo "🌐 Access URLs (add to /etc/hosts):"
echo "  Frontend: http://conference-app.local"
echo "  API: http://conference-app.local/api"
echo "  Grafana: http://monitoring.conference-app.local"
echo "  Prometheus: http://prometheus.conference-app.local"
echo ""
echo "📊 Check deployment status:"
echo "  kubectl get pods -n conference-app"
echo "  kubectl get services -n conference-app"
echo "  kubectl get ingress -n conference-app"