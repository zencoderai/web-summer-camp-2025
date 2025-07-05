#!/bin/bash

# Conference App Kubernetes Cleanup Script

set -e

echo "🧹 Starting Conference App cleanup from Kubernetes..."

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

# Remove ingress first
echo "🌍 Removing ingress..."
kubectl delete -f ingress.yaml --ignore-not-found=true

# Remove deployments
echo "🔧 Removing deployments..."
kubectl delete -f backend.yaml --ignore-not-found=true
kubectl delete -f frontend.yaml --ignore-not-found=true
kubectl delete -f prometheus.yaml --ignore-not-found=true
kubectl delete -f grafana.yaml --ignore-not-found=true
kubectl delete -f postgres.yaml --ignore-not-found=true

# Remove configmaps and secrets
echo "🔐 Removing configmaps and secrets..."
kubectl delete -f configmaps.yaml --ignore-not-found=true
kubectl delete -f prometheus-config.yaml --ignore-not-found=true
kubectl delete -f secrets.yaml --ignore-not-found=true

# Remove persistent volumes (optional - comment out if you want to keep data)
echo "💾 Removing persistent volumes..."
kubectl delete -f persistent-volumes.yaml --ignore-not-found=true

# Remove namespace (this will remove everything in the namespace)
echo "📦 Removing namespace..."
kubectl delete -f namespace.yaml --ignore-not-found=true

echo "✅ Cleanup completed successfully!"
echo ""
echo "📋 Cleanup Summary:"
echo "  All resources in 'conference-app' namespace have been removed"
echo ""
echo "🔍 Verify cleanup:"
echo "  kubectl get all -n conference-app"