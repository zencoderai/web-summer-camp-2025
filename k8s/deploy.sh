#!/bin/bash

# Conference App Kubernetes Deployment Script
set -e

echo "🚀 Starting Conference App Deployment to Kubernetes"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster"
    exit 1
fi

print_success "Connected to Kubernetes cluster"

# Build Docker images
print_status "Building Docker images..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

# Build backend image
print_status "Building backend image..."
docker build -t conference-backend:latest ./backend
if [ $? -eq 0 ]; then
    print_success "Backend image built successfully"
else
    print_error "Failed to build backend image"
    exit 1
fi

# Build frontend image
print_status "Building frontend image..."
docker build -t conference-frontend:latest ./frontend
if [ $? -eq 0 ]; then
    print_success "Frontend image built successfully"
else
    print_error "Failed to build frontend image"
    exit 1
fi

# Check if NGINX Ingress Controller is installed
print_status "Checking for NGINX Ingress Controller..."
if kubectl get ingressclass nginx &> /dev/null; then
    print_success "NGINX Ingress Controller found"
else
    print_warning "NGINX Ingress Controller not found"
    echo "To install NGINX Ingress Controller, run:"
    echo "kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml"
    echo ""
    read -p "Continue without ingress? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Deploy using kustomize
print_status "Deploying application using kustomize..."
kubectl apply -k k8s/

if [ $? -eq 0 ]; then
    print_success "Application deployed successfully"
else
    print_error "Failed to deploy application"
    exit 1
fi

# Wait for deployments to be ready
print_status "Waiting for deployments to be ready..."

deployments=("postgres" "backend" "frontend" "prometheus" "grafana" "postgres-exporter")

for deployment in "${deployments[@]}"; do
    print_status "Waiting for $deployment to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/$deployment -n conference-app
    if [ $? -eq 0 ]; then
        print_success "$deployment is ready"
    else
        print_warning "$deployment is not ready yet, but continuing..."
    fi
done

# Display access information
echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Access Information:"
echo "===================="

# Check if ingress is available
if kubectl get ingress -n conference-app &> /dev/null; then
    echo "🌐 Web Access (add to /etc/hosts):"
    echo "   Frontend:   http://conference.local"
    echo "   Backend:    http://api.conference.local"
    echo "   Grafana:    http://grafana.conference.local (admin/admin)"
    echo "   Prometheus: http://prometheus.conference.local"
    echo ""
    echo "   Get ingress IP: kubectl get ingress -n conference-app"
fi

echo "🔌 Port Forward Access:"
echo "   Frontend:   kubectl port-forward -n conference-app svc/frontend-service 3000:3000"
echo "   Backend:    kubectl port-forward -n conference-app svc/backend-service 8000:8000"
echo "   Grafana:    kubectl port-forward -n conference-app svc/grafana-service 3001:3000"
echo "   Prometheus: kubectl port-forward -n conference-app svc/prometheus-service 9090:9090"
echo ""

echo "🔍 Monitoring Commands:"
echo "   Check pods:     kubectl get pods -n conference-app"
echo "   Check services: kubectl get svc -n conference-app"
echo "   Check logs:     kubectl logs -f deployment/<deployment-name> -n conference-app"
echo ""

echo "🗑️  Cleanup:"
echo "   Remove app:     kubectl delete -k k8s/"
echo ""

print_success "Conference App is now running on Kubernetes! 🎊"